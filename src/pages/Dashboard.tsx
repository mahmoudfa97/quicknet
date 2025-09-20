import { useClients } from '@/hooks/useClients';
import { Layout } from '@/components/Layout';
import { StatsCards } from '@/components/StatsCards';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Activity, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { clients, payments, getTotalStats } = useClients();
  const [stats, setState] = useState<{
    totalClients: number;
    totalBalance: number;
    totalPayments: number;
    recentPayments: number;
  }>(getTotalStats());

  // Get recent payments (last 5)
  const recentPayments = payments
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  useEffect(() => {
    let stats = getTotalStats();
    setState(stats);
  }, [ clients, payments]);
  
  // Get clients with highest balances
  const topClients = clients
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return (
    <Layout title="Dashboard Overview">
      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 shadow-card hover:shadow-elegant transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            <Link to="/clients">
              <Button variant="professional" className="w-full justify-start">
                <Users className="w-4 h-4" />
                Manage Clients
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link to="/clients">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4" />
                Add New Client
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-6 shadow-card hover:shadow-elegant transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent payments</p>
            ) : (
              recentPayments.map((payment) => {
                const client = clients.find(c => c.id === payment.clientId);
                return (
                  <div key={payment.id} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{client?.clientName}</p>
                      <p className="text-muted-foreground">
                        {payment.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-success">
                      ₪{payment.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          {recentPayments.length > 0 && (
            <Link to="/payments">
              <Button variant="ghost" size="sm" className="w-full mt-3">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </Card>

        {/* Top Clients */}
        <Card className="p-6 shadow-card hover:shadow-elegant transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top Clients</h3>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet</p>
            ) : (
              topClients.map((client) => (
                <div key={client.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{client.clientName}</p>
                    <p className="text-muted-foreground">{client.invoiceNumber}</p>
                  </div>
                  <span className="font-semibold text-success">
                    ₪{client.balance.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          {topClients.length > 0 && (
            <Link to="/clients">
              <Button variant="ghost" size="sm" className="w-full mt-3">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">All systems operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{clients.length}</p>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{payments.length}</p>
            <p className="text-sm text-muted-foreground">Total Payments</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              ₪{stats.totalBalance.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Balance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {stats.recentPayments}
            </p>
            <p className="text-sm text-muted-foreground">Today's Payments</p>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Dashboard;
