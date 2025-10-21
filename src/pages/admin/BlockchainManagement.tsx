import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockchainDashboard } from "@/components/admin/BlockchainDashboard";
import { BlockchainPolicyManager } from "@/components/admin/BlockchainPolicyManager";
import { SystemMonitoringDashboard } from "@/components/admin/SystemMonitoringDashboard";
import { BlockchainPruningManager } from "@/components/admin/BlockchainPruningManager";
import Layout from "@/components/Layout";
import { Shield } from "lucide-react";

export default function BlockchainManagement() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Blockchain Management</h1>
          </div>
          <p className="text-muted-foreground">
            Quantum-resistant blockchain for immutable audit trails and decentralized identity
          </p>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="policies">Smart Policies</TabsTrigger>
            <TabsTrigger value="pruning">Pruning</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="dids">DIDs</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <SystemMonitoringDashboard />
          </TabsContent>

          <TabsContent value="dashboard">
            <BlockchainDashboard />
          </TabsContent>

          <TabsContent value="policies">
            <BlockchainPolicyManager />
          </TabsContent>

          <TabsContent value="pruning">
            <BlockchainPruningManager />
          </TabsContent>

          <TabsContent value="audit">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Blockchain audit trail viewer coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="dids">
            <div className="text-center py-12">
              <p className="text-muted-foreground">DID management interface coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
