import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedQuantumBlockchain } from '@/lib/enhanced-quantum-blockchain';
import { QuantumTransaction } from '@/lib/quantum-blockchain';
import { DIDManager, QuantumDID } from '@/lib/did-manager';
import { toast } from '@/hooks/use-toast';

export interface BlockchainStatus {
  height: number;
  totalTransactions: number;
  isQuantumResistant: boolean;
  lastBlockTime: Date;
}

export function useBlockchain() {
  const { user } = useAuth();
  const [blockchain] = useState(() => new EnhancedQuantumBlockchain(2));
  const [did, setDID] = useState<QuantumDID | null>(null);
  const [loading, setLoading] = useState(true);
  const [chainStatus, setChainStatus] = useState<BlockchainStatus | null>(null);

  useEffect(() => {
    if (user) {
      initializeUserBlockchain();
      updateChainStatus();
    }
  }, [user]);

  const initializeUserBlockchain = async () => {
    try {
      setLoading(true);
      
      // Check if user has DID
      const { data: existingDID } = await supabase
        .from('user_dids')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (existingDID) {
        setDID(existingDID.did_document as any as QuantumDID);
      } else {
        // Create DID for new user
        const newDID = await DIDManager.createDID(user?.email || 'unknown');
        
        // Store DID in database
        await supabase
          .from('user_dids')
          .insert({
            user_id: user?.id,
            did: newDID.id,
            did_document: JSON.stringify(newDID)
          });
        
        setDID(newDID);
        
        // Log identity creation to blockchain
        blockchain.addTransaction({
          type: 'audit_log',
          payload: {
            action: 'IDENTITY_CREATED',
            userId: user?.id,
            did: newDID.id
          },
          userId: user?.id,
          timestamp: Date.now()
        });
        await blockchain.minePendingTransactions(user?.id || 'system');
      }
    } catch (error) {
      console.error('Error initializing blockchain:', error);
      toast({
        title: "Blockchain Error",
        description: "Failed to initialize blockchain identity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateChainStatus = useCallback(() => {
    const stats = blockchain.getStatistics();
    setChainStatus({
      height: stats.totalBlocks,
      totalTransactions: stats.totalTransactions,
      isQuantumResistant: true,
      lastBlockTime: new Date()
    });
  }, [blockchain]);

  const logAuditToBlockchain = async (
    action: string,
    resource: string,
    details: Record<string, any>
  ) => {
    try {
      blockchain.addTransaction({
        type: 'audit_log',
        payload: {
          action,
          resource,
          details,
          userId: user?.id
        },
        userId: user?.id,
        timestamp: Date.now()
      });
      
      // Mine the block
      await blockchain.minePendingTransactions(user?.id || 'system');
      
      updateChainStatus();
      
      return 'transaction-' + Date.now();
    } catch (error) {
      console.error('Error logging to blockchain:', error);
      throw error;
    }
  };

  const verifyAuditTrail = async (resource: string): Promise<boolean> => {
    try {
      // Verify blockchain integrity
      const isValid = await blockchain.isValidChain();
      
      return isValid;
    } catch (error) {
      console.error('Error verifying audit trail:', error);
      return false;
    }
  };

  const grantPermissionOnChain = async (
    targetUserId: string,
    resource: string,
    action: string,
    expiresAt?: Date
  ) => {
    try {
      blockchain.addTransaction({
        type: 'access_event',
        payload: {
          action: 'GRANT_PERMISSION',
          granterId: user?.id,
          targetUserId,
          resource,
          permissionAction: action,
          expiresAt: expiresAt?.toISOString()
        },
        userId: user?.id,
        timestamp: Date.now()
      });
      
      const block = await blockchain.minePendingTransactions(user?.id || 'system');
      const txnId = `grant-${block.index}-${Date.now()}`;
      
      // Also update database
      await supabase
        .from('blockchain_permissions')
        .insert({
          granter_id: user?.id,
          grantee_id: targetUserId,
          resource,
          action,
          blockchain_txn_id: txnId,
          expires_at: expiresAt?.toISOString()
        });
      
      updateChainStatus();
      
      toast({
        title: "Permission Granted",
        description: "Permission recorded on blockchain",
      });
      
      return txnId;
    } catch (error) {
      console.error('Error granting permission on blockchain:', error);
      toast({
        title: "Error",
        description: "Failed to grant permission on blockchain",
        variant: "destructive"
      });
      throw error;
    }
  };

  const revokePermissionOnChain = async (
    targetUserId: string,
    resource: string,
    action: string
  ) => {
    try {
      blockchain.addTransaction({
        type: 'access_event',
        payload: {
          action: 'REVOKE_PERMISSION',
          revokerId: user?.id,
          targetUserId,
          resource,
          permissionAction: action
        },
        userId: user?.id,
        timestamp: Date.now()
      });
      
      const block = await blockchain.minePendingTransactions(user?.id || 'system');
      const txnId = `revoke-${block.index}-${Date.now()}`;
      
      // Update database
      await supabase
        .from('blockchain_permissions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('granter_id', user?.id)
        .eq('grantee_id', targetUserId)
        .eq('resource', resource)
        .eq('action', action)
        .is('revoked_at', null);
      
      updateChainStatus();
      
      toast({
        title: "Permission Revoked",
        description: "Revocation recorded on blockchain",
      });
      
      return txnId;
    } catch (error) {
      console.error('Error revoking permission on blockchain:', error);
      throw error;
    }
  };

  const getBlockchainAuditTrail = async (resource: string) => {
    try {
      // Filter blockchain data by resource
      const allBlocks = blockchain.chain;
      const trail = allBlocks.flatMap(block => 
        block.data.filter(tx => tx.payload?.resource === resource)
      );
      return trail;
    } catch (error) {
      console.error('Error getting blockchain audit trail:', error);
      return [];
    }
  };

  const getUserTransactions = async (userId: string) => {
    try {
      const allBlocks = blockchain.chain;
      const transactions = allBlocks.flatMap(block =>
        block.data.filter(tx => tx.userId === userId)
      );
      return transactions;
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  };

  const mineBlock = async () => {
    try {
      const minerAddress = did?.id || user?.id || 'unknown';
      const block = await blockchain.minePendingTransactions(minerAddress);
      
      // Store block info in database
      await supabase
        .from('blockchain_blocks')
        .insert({
          block_index: block.index,
          block_hash: block.hash,
          previous_hash: block.previousHash,
          merkle_root: block.merkleRoot,
          miner_id: user?.id,
          nonce: block.nonce,
          difficulty: block.difficulty,
          transaction_count: block.data.length
        });
      
      updateChainStatus();
      
      toast({
        title: "Block Mined",
        description: `Block #${block.index} mined successfully`,
      });
      
      return block;
    } catch (error) {
      console.error('Error mining block:', error);
      throw error;
    }
  };

  const exportBlockchainData = async () => {
    try {
      const stats = blockchain.getStatistics();
      const blocks = blockchain.chain;
      
      return {
        chainInfo: {
          height: stats.totalBlocks,
          totalTransactions: stats.totalTransactions,
          isQuantumResistant: true
        },
        blocks,
        isValid: await blockchain.isValidChain()
      };
    } catch (error) {
      console.error('Error exporting blockchain:', error);
      throw error;
    }
  };

  const evaluateAccessPolicy = async (
    resource: string,
    action: string,
    userRoles: string[],
    trustScore: number,
    mfaVerified: boolean
  ): Promise<boolean> => {
    try {
      // Basic policy evaluation
      // In production, implement comprehensive policy engine
      return trustScore > 50 && mfaVerified;
    } catch (error) {
      console.error('Error evaluating access policy:', error);
      return false;
    }
  };

  return {
    did,
    loading,
    chainStatus,
    blockchain,
    logAuditToBlockchain,
    verifyAuditTrail,
    grantPermissionOnChain,
    revokePermissionOnChain,
    getBlockchainAuditTrail,
    getUserTransactions,
    mineBlock,
    exportBlockchainData,
    updateChainStatus,
    evaluateAccessPolicy
  };
}
