'use client'
import React, { useEffect, useState } from 'react';
import { Card, Statistic, Typography, Space, Skeleton, Table } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { DashboardService } from '@/services/dashboard';

const { Title, Text } = Typography;

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valor (R$)',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#cf1322' : '#3f8600' }}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, transactionsResponse] = await Promise.all([
          DashboardService.dashboard(),
          DashboardService.getRecentTransactions(),
        ]);

        if (isMounted) {
          setDashboardData({
            balance: dashboardResponse.data.balance,
            income: dashboardResponse.data.monthlyIncome,
            expenses: dashboardResponse.data.lastMonthExpense,
          });
          setRecentTransactions(
            transactionsResponse.data.map((transaction: { id: string; }, index: number) => ({
              ...transaction,
              key: transaction.id || index, 
            }))
          );
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg">
      <Title level={3}>Resumo Financeiro</Title>

      {loading ? (
        <Space size="large" className="flex flex-wrap mt-6">
            <Card className="min-w-sm">
            <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          <Card className="min-w-sm">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card className="min-w-sm">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Space>
      ) : (
        <Space size="large" className="flex flex-wrap mt-6">
          <Card className="min-w-sm">
            <Statistic
              title="Saldo Disponível"
              value={dashboardData.balance}
              precision={2}
              prefix="R$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>

          <Card className="min-w-sm">
            <Statistic
              title="Receitas (Mês)"
              value={dashboardData.income}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>

          <Card className="min-w-sm">
            <Statistic
              title="Despesas (Mês)"
              value={dashboardData.expenses}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Space>
      )}

      <div className="mt-8">
        <Title level={4}>Atividades Recentes</Title>
        <Text type="secondary">Aqui estão suas últimas transações</Text>

        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Table
            dataSource={recentTransactions}
            columns={columns}
            pagination={false}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
};

export default Home;