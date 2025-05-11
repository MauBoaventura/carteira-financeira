'use client'
import React, { useEffect, useState } from 'react';
import { Card, Statistic, Typography, Space, Skeleton } from 'antd';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Evitar múltiplas requisições

    const fetchDashboardData = async () => {
      try {
        const response = await DashboardService.dashboard();
        if (isMounted) {
          setDashboardData({
            balance: response.data.balance,
            income: response.data.monthlyIncome,
            expenses: response.data.lastMonthExpense,
          });
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
        <Space size="large" className="mt-6">
          <Card style={{ width: 300 }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card style={{ width: 300 }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card style={{ width: 300 }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Space>
      ) : (
        <Space size="large" className="mt-6">
          <Card style={{ width: 300 }}>
            <Statistic
              title="Saldo Disponível"
              value={dashboardData.balance}
              precision={2}
              prefix="R$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>

          <Card style={{ width: 300 }}>
            <Statistic
              title="Receitas (Mês)"
              value={dashboardData.income}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>

          <Card style={{ width: 300 }}>
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

        {/* Aqui você pode adicionar uma tabela de transações recentes */}
      </div>
    </div>
  );
};

export default Home;