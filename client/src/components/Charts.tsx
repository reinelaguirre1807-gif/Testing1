import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useTheme } from "@/contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function SpendingChart() {
  const { theme } = useTheme();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#374151',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#374151',
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#374151',
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Expenses',
        data: [1200, 1900, 1650, 1800, 1550, 1850],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <Card data-testid="chart-spending-trends">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line options={chartOptions} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryChart() {
  const { theme } = useTheme();
  
  const { data: categoryData = [] } = useQuery<{ category: string; amount: number }[]>({
    queryKey: ['/api/analytics/category-spending'],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#374151',
        },
      },
    },
  };

  const chartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: [
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
          '#EF4444',
          '#F97316',
          '#84CC16',
          '#06B6D4',
        ],
      },
    ],
  };

  return (
    <Card data-testid="chart-category-breakdown">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Doughnut options={chartOptions} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
