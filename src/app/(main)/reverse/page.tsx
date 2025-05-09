'use client'
import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Button, Modal, message, Tag, Space, Spin, DatePicker, Input } from 'antd';
import { ExclamationCircleOutlined, UndoOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from '@/hooks/use-location';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

// Tipos e mocks - substituir por chamadas à API real
type Operation = {
  id: string;
  type: 'DEPOSIT' | 'TRANSFER' | 'WITHDRAWAL';
  amount: number;
  date: string;
  status: 'COMPLETED' | 'FAILED' | 'REVERSED' | 'PENDING';
  counterparty?: string;
  description?: string;
  reversible: boolean;
};

const mockOperations: Operation[] = [
  {
    id: '1',
    type: 'TRANSFER',
    amount: 150.50,
    date: '2023-05-15T10:30:00',
    status: 'COMPLETED',
    counterparty: 'João Silva',
    description: 'Pagamento de serviços',
    reversible: true
  },
  {
    id: '2',
    type: 'DEPOSIT',
    amount: 500.00,
    date: '2023-05-14T09:15:00',
    status: 'COMPLETED',
    description: 'Depósito inicial',
    reversible: true
  },
  {
    id: '3',
    type: 'TRANSFER',
    amount: 200.00,
    date: '2023-05-10T14:45:00',
    status: 'REVERSED',
    counterparty: 'Maria Souza',
    description: 'Transferência errada',
    reversible: false
  },
];

const ReversalPage = () => {
  const { userRole } = useLocation();
  const [operations, setOperations] = useState<Operation[]>(mockOperations);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>(mockOperations);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    searchText: '',
  });

  useEffect(() => {
    // Simula carregamento de dados
    setLoading(true);
    setTimeout(() => {
      filterOperations();
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const filterOperations = () => {
    let result = [...operations];
    
    // Filtro por data
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      result = result.filter(op => 
        dayjs(op.date).isAfter(start.startOf('day')) && 
        dayjs(op.date).isBefore(end.endOf('day'))
      );
    }
    
    // Filtro por texto (ID, contraparte ou descrição)
    if (searchParams.searchText) {
      const searchText = searchParams.searchText.toLowerCase();
      result = result.filter(op => 
        op.id.toLowerCase().includes(searchText) ||
        (op.counterparty && op.counterparty.toLowerCase().includes(searchText)) ||
        (op.description && op.description.toLowerCase().includes(searchText))
      );
    }
    
    setFilteredOperations(result);
  };

  const handleReverseOperation = (operationId: string) => {
    confirm({
      title: 'Confirmar reversão',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja reverter esta operação? Esta ação não pode ser desfeita.',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => performReversal(operationId),
    });
  };

  const performReversal = async (operationId: string) => {
    setLoading(true);
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza o status na lista local (em produção, atualizar com resposta da API)
      setOperations(prev => prev.map(op => 
        op.id === operationId ? { ...op, status: 'REVERSED', reversible: false } : op
      ));
      
      message.success('Operação revertida com sucesso!');
      filterOperations(); // Reaplica os filtros
    } catch (error) {
      message.error('Falha ao reverter operação');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          DEPOSIT: { text: 'Depósito', color: 'green' },
          TRANSFER: { text: 'Transferência', color: 'blue' },
          WITHDRAWAL: { text: 'Saque', color: 'orange' },
        };
        return <Tag color={typeMap[type]?.color || 'default'}>{typeMap[type]?.text || type}</Tag>;
      },
    },
    {
      title: 'Valor (R$)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toFixed(2),
      align: 'right' as const,
    },
    {
      title: 'Data/Hora',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Contraparte',
      dataIndex: 'counterparty',
      key: 'counterparty',
      render: (counterparty: string) => counterparty || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          COMPLETED: { text: 'Concluído', color: 'success' },
          FAILED: { text: 'Falhou', color: 'error' },
          REVERSED: { text: 'Revertido', color: 'default' },
          PENDING: { text: 'Pendente', color: 'processing' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: string, record: Operation) => (
        <Space>
          <Button
            type="link"
            icon={<UndoOutlined />}
            onClick={() => handleReverseOperation(record.id)}
            disabled={!record.reversible}
            title={record.reversible ? 'Reverter operação' : 'Operação não pode ser revertida'}
          >
            Reverter
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg">
      <Title level={3}>Reversão de Operações</Title>
      <Text type="secondary">Reverta operações em caso de inconsistências</Text>

      <Card style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <RangePicker
            style={{ width: 250 }}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setSearchParams({ ...searchParams, dateRange: [dates[0], dates[1]] });
              } else {
                setSearchParams({ ...searchParams, dateRange: null });
              }
            }}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
          
          <Input
            placeholder="Buscar por ID, contraparte ou descrição"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchParams({...searchParams, searchText: e.target.value})}
            allowClear
          />
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredOperations}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  <p><Text strong>Descrição:</Text> {record.description || 'Nenhuma descrição'}</p>
                  {record.status === 'REVERSED' && (
                    <p><Text type="secondary">Esta operação foi revertida</Text></p>
                  )}
                </div>
              ),
              rowExpandable: (record) => !!record.description || record.status === 'REVERSED',
            }}
          />
        </Spin>
      </Card>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <Title level={5} className="mb-2">Sobre a reversão de operações</Title>
        <Text>
          - Apenas operações concluídas nos últimos 30 dias podem ser revertidas<br />
          - Operações já revertidas ou com status de falha não podem ser revertidas<br />
          - O processo de reversão pode levar até 48 horas para ser completado<br />
          - Em caso de dúvidas, entre em contato com nosso suporte
        </Text>
      </div>
    </div>
  );
};

export default ReversalPage;