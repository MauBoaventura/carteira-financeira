'use client'
import React from 'react';
import { Layout, Menu, Card, Statistic, Typography, Space, Avatar, Badge } from 'antd';
import {
  WalletOutlined,
  PieChartOutlined,
  TransactionOutlined,
  UserOutlined,
  BellOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useLocation } from '@/hooks/use-location';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const { userRole, pathname } = useLocation();

  return (

        <div className="p-6 bg-white rounded-lg">
          <Title level={3}>Resumo Financeiro</Title>

          <Space size="large" className="mt-6">
            <Card style={{ width: 300 }}>
              <Statistic
                title="Saldo Disponível"
                value={5684.32}
                precision={2}
                prefix="R$"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>

            <Card style={{ width: 300 }}>
              <Statistic
                title="Receitas (Mês)"
                value={12500}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>

            <Card style={{ width: 300 }}>
              <Statistic
                title="Despesas (Mês)"
                value={6815.68}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Space>

          <div className="mt-8">
            <Title level={4}>Atividades Recentes</Title>
            <Text type="secondary">Aqui estão suas últimas transações</Text>

            {/* Aqui você pode adicionar uma tabela de transações recentes */}
          </div>
        </div>

  );
}

export default Home;