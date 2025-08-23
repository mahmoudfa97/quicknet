import { Card } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalClients: number;
    totalBalance: number;
    totalPayments: number;
    recentPayments: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Balance',
      value: `₪${stats.totalBalance.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Payments',
      value: `₪${stats.totalPayments.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Today\'s Payments',
      value: stats.recentPayments.toString(),
      icon: Clock,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="p-6 shadow-card hover:shadow-elegant transition-all duration-200 animate-slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
