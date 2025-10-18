import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { QuantumBlockchain, QuantumTransaction } from '@/lib/quantum-blockchain';
import { BlockchainIntegration } from '@/lib/blockchain-integration';
import { DIDManager, QuantumDID } from '@/lib/did-manager';
import { BlockchainPolicyEngine, PolicyEvaluationContext } from '@/lib/blockchain-policy-engine';
import { toast } from '@/hooks/use-toast';

export interface BlockchainStatus {
  height: number;
  totalTransactions: number;
  isQuantumResistant: boolean;
  lastBlockTime: Date;
}

export function useBlockchain() {
  const { user } = useAuth();
  const [blockchain] = useState(() => new QuantumBlockchain());
  const [integration] = useState(() => new BlockchainIntegration(blockchain));
  const [policyEngine] = useState(() => integration.getPolicyEngine());
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
        await integration.logIdentityCreation(user?.id || '', newDID);
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
    const info = blockchain.getChainInfo();
    setChainStatus({
      height: info.height,
      totalTransactions: info.totalTransactions,
      isQuantumResistant: info.isQuantumResistant,
      lastBlockTime: info.lastBlockTime
    });
  }, [blockchain]);

  const logAuditToBlockchain = async (
    action: string,
    resource: string,
    details: Record<string, any>
  ) => {
    try {
      const txnId = await integration.logAuditEvent(
        user?.id || '',
        action,
        resource,
        details
      );
      
      updateChainStatus();
      
      return txnId;
    } catch (error) {
      console.error('Error logging to blockchain:', error);
      throw error;
    }
  };

  const verifyAuditTrail = async (resource: string): Promise<boolean> => {
    try {
      const trail = blockchain.getAuditTrail(resource);
      
      // Verify blockchain integrity
      const isValid = await blockchain.isValidChain();
      
      // Verify each transaction
      for (const txn of trail) {
        const isValidTxn = await blockchain.isValidTransaction(txn);
        if (!isValidTxn) {
          return false;
        }
      }
      
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
      const txnId = await integration.grantPermission(
        user?.id || '',
        targetUserId,
        resource,
        action,
        expiresAt
      );
      
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
      const txnId = await integration.revokePermission(
        user?.id || '',
        targetUserId,
        resource,
        action
      );
      
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
      const trail = blockchain.getAuditTrail(resource);
      return trail;
    } catch (error) {
      console.error('Error getting blockchain audit trail:', error);
      return [];
    }
  };

  const getUserTransactions = async (userId: string) => {
    try {
      const transactions = blockchain.getTransactionsByUser(userId);
      return transactions;
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  };

  const mineBlock = async () => {
    try {
      const minerAddress = did?.id || user?.id || 'unknown';
      const block = await blockchain.mineBlock(minerAddress);
      
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
      const chainInfo = blockchain.getChainInfo();
      const blocks = [];
      
      for (let i = 0; i < chainInfo.height; i++) {
        const block = blockchain.getBlock(i);
        if (block) {
          blocks.push(block);
        }
      }
      
      return {
        chainInfo,
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
      const context: PolicyEvaluationContext = {
        userId: user?.id || '',
        userRoles,
        resource,
        action,
        timestamp: new Date(),
        trustScore,
        mfaVerified,
        quantumSignature: did?.id
      };

      return await integration.evaluateAccess(context);
    } catch (error) {
      console.error('Error evaluating access policy:', error);
      return false;
    }
  };

  const getPolicyEngine = () => policyEngine;

  return {
    did,
    loading,
    chainStatus,
    blockchain,
    integration,
    policyEngine,
    logAuditToBlockchain,
    verifyAuditTrail,
    grantPermissionOnChain,
    revokePermissionOnChain,
    getBlockchainAuditTrail,
    getUserTransactions,
    mineBlock,
    exportBlockchainData,
    updateChainStatus,
    evaluateAccessPolicy,
    getPolicyEngine
  };
}
