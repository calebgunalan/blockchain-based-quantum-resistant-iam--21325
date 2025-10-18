import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Key, 
  Activity, 
  FileText, 
  Settings, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Zap,
  User,
  Monitor
} from 'lucide-react';

export function UserGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">IAM System User Guide</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive guide to using the Identity and Access Management system
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admin">Admin Guide</TabsTrigger>
          <TabsTrigger value="user">User Guide</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>
                Understanding the IAM system architecture and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Core Components</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      User Management & Roles
                    </li>
                    <li className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      API Key Management
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Session Monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Audit Logging
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Zero Trust Policies
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Security Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Quantum-Resistant Security
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Multi-Factor Authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Threat Detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approval Workflows
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Real-time Monitoring
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-medium">Admin Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Administrator creates user accounts and assigns initial roles through the User Management panel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-medium">User Onboarding</h4>
                    <p className="text-sm text-muted-foreground">
                      New users receive email invitations and complete their profile setup including MFA.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-medium">Resource Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Users access resources based on their roles and permissions, with all activities being logged.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Guide</CardTitle>
              <CardDescription>
                Complete guide for system administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">User Management</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Create:</span>
                    <span>Navigate to Admin → User Management → Add User. Enter email, password, full name, and assign role.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Edit:</span>
                    <span>Click the pen icon next to any user to modify their profile, role, or group memberships.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Delete:</span>
                    <span>Use the delete button with caution - this permanently removes user access.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Role Management</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">System Roles:</span>
                    <span>Admin (full access), Moderator (limited admin), User (basic access)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Custom Roles:</span>
                    <span>Create custom roles with specific permission sets for specialized access needs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Permissions:</span>
                    <span>Assign granular permissions for specific resources and actions.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Session Management</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Monitor:</span>
                    <span>View all active user sessions with location, IP, and activity details.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Terminate:</span>
                    <span>Force-terminate suspicious or inactive sessions immediately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Audit:</span>
                    <span>All session activities are logged for security compliance.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Security Monitoring</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Attacks:</span>
                    <span>Monitor simulated quantum attacks and system responses in Attack Logs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Policies:</span>
                    <span>Configure Zero Trust policies for automated threat response.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Compliance:</span>
                    <span>Generate compliance reports and export audit logs for regulations.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Guide</CardTitle>
              <CardDescription>
                Guide for regular users and moderators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Profile Management</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Profile:</span>
                    <span>Update your name, avatar, and personal information in Profile → Profile tab.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Security:</span>
                    <span>Enable MFA and manage security settings in Profile → Security tab.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Sessions:</span>
                    <span>Monitor your active sessions and terminate suspicious ones.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">API Access</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Keys:</span>
                    <span>Generate and manage API keys for programmatic access to resources.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Limits:</span>
                    <span>Each key has rate limits and expiration dates for security.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Quantum:</span>
                    <span>Enable quantum-safe API keys for future-proof security.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Approval Requests</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Submit:</span>
                    <span>Request elevated permissions or role changes through the approval system.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Track:</span>
                    <span>Monitor request status and view approval history.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Justify:</span>
                    <span>Provide clear business justification for all requests.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>
                Understanding the advanced security capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Quantum Security</h4>
                <div className="space-y-2 text-sm">
                  <p>Our system uses post-quantum cryptography to protect against future quantum computer attacks:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>ML-KEM-768 for key exchange</li>
                    <li>ML-DSA-65 for digital signatures</li>
                    <li>Automatic key rotation</li>
                    <li>Quantum-resistant algorithms</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Zero Trust Architecture</h4>
                <div className="space-y-2 text-sm">
                  <p>Every request is verified using multiple factors:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>User identity and role verification</li>
                    <li>Device trustworthiness assessment</li>
                    <li>Network location analysis</li>
                    <li>Behavioral pattern matching</li>
                    <li>Risk score calculation</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI-Powered Risk Assessment</h4>
                <div className="space-y-2 text-sm">
                  <p>Machine learning algorithms continuously assess user risk:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Behavioral analytics and anomaly detection</li>
                    <li>Threat intelligence integration</li>
                    <li>Dynamic trust scoring</li>
                    <li>Predictive risk modeling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Authentication Issues</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium">Cannot sign in</p>
                    <p className="text-sm text-muted-foreground">
                      Check email verification status. Contact admin if account is locked.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium">Session expired</p>
                    <p className="text-sm text-muted-foreground">
                      Sessions expire after 30 days. Sign in again to continue.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Permission Denied</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-medium">Access denied to resource</p>
                    <p className="text-sm text-muted-foreground">
                      Submit an approval request for elevated permissions or contact your administrator.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-medium">Role change needed</p>
                    <p className="text-sm text-muted-foreground">
                      Use the approval system to request role changes with business justification.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Technical Issues</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">API key not working</p>
                    <p className="text-sm text-muted-foreground">
                      Check key expiration and rate limits in Profile → API Keys section.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">Quantum security errors</p>
                    <p className="text-sm text-muted-foreground">
                      Ensure quantum security is enabled in Profile → Security → Quantum Protection.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Administrative Features</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">User Management (/admin/user-management)</p>
                      <p className="text-muted-foreground">Create, edit, delete users and manage roles</p>
                    </div>
                    <div>
                      <p className="font-medium">Role Management (/admin/roles)</p>
                      <p className="text-muted-foreground">Create custom roles and assign permissions</p>
                    </div>
                    <div>
                      <p className="font-medium">Session Management (/admin/session-management)</p>
                      <p className="text-muted-foreground">Monitor and terminate user sessions</p>
                    </div>
                    <div>
                      <p className="font-medium">Audit Logs (/admin/audit-logs)</p>
                      <p className="text-muted-foreground">View system activities and download logs</p>
                    </div>
                    <div>
                      <p className="font-medium">Attack Logs (/admin/attack-logs)</p>
                      <p className="text-muted-foreground">Monitor security threats and system responses</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">User Features</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Profile (/profile)</p>
                      <p className="text-muted-foreground">Manage personal information and security settings</p>
                    </div>
                    <div>
                      <p className="font-medium">Resources (/resources)</p>
                      <p className="text-muted-foreground">Access controlled resources based on permissions</p>
                    </div>
                    <div>
                      <p className="font-medium">Quantum Security (/quantum-security)</p>
                      <p className="text-muted-foreground">Enable quantum-resistant cryptographic protection</p>
                    </div>
                    <div>
                      <p className="font-medium">API Keys</p>
                      <p className="text-muted-foreground">Generate and manage programmatic access keys</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}