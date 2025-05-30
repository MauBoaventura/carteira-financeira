'use client'
import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Button, Modal, Tag, Space, Spin, DatePicker, Input } from 'antd';
import { ExclamationCircleOutlined, UndoOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from '@/hooks/use-location';
import { ReverseService } from '@/services/reverse';
import { ReverseResponse } from '@/services/reverse/types';
import dayjs from 'dayjs';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useBankStore } from '@/store/useWalletStore';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type Operation = {
  id: string;
  type: 'DEPOSIT' | 'TRANSFER' | 'WITHDRAWAL';
  amount: number;
  date: string;
  status: 'COMPLETED' | 'FAILED' | 'REVERSED' | 'PENDING';
  counterparty?: User;
  description?: string;
  reversible: boolean;
};


const transformReverseResponseToOperation = (data: ReverseResponse[]): Operation[] => {
  return data.map(item => ({
    id: item.id,
    type: item.type,
    amount: item.amount,
    date: item.date,
    counterparty: item.counterparty || undefined,
    status: item.status,
    reversible: item.reversible,
  }));
};

const ReversalPage = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    searchText: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const { updateBalance } = useBankStore()

  const showModal = (operation: Operation) => {
    setSelectedOperation(operation);
    setModalVisible(true);
  };

  const handleConfirmReversal = async () => {
    if (selectedOperation) {
      try {
        await performReversal(selectedOperation.id);
        setModalVisible(false);
        setSelectedOperation(null);
      } catch (error) {
        console.error("Erro ao reverter operação:", error);
        toast.error("Erro ao reverter operação");

      }
    }
  };

  const handleCancelReversal = () => {
    setModalVisible(false);
    setSelectedOperation(null);
  };

  useEffect(() => {
    const fetchOperations = async () => {
      setLoading(true);
      try {
        const response = await ReverseService.getAll();
        const transformedData = transformReverseResponseToOperation(response.data);
        setOperations(transformedData);
        setFilteredOperations(transformedData);
      } catch (error) {
        console.error("Erro ao carregar operações:", error);
        toast.error("Erro ao carregar a lista de operações");
      } finally {
        setLoading(false);
      }
    };

    fetchOperations();
  }, []);

  useEffect(() => {
    if (!operations.length) return;
    setLoading(true);
    setTimeout(() => {
      filterOperations();
      setLoading(false);
    }, 50000);


  }, [searchParams]);

  const filterOperations = () => {
    let result = [...operations];
    
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      result = result.filter(op => 
        dayjs(op.date).isAfter(start.startOf('day')) && 
        dayjs(op.date).isBefore(end.endOf('day'))
      );
    }
    
    if (searchParams.searchText) {
      const searchText = searchParams.searchText.toLowerCase();
      result = result.filter(op => 
        op.id.toLowerCase().includes(searchText) ||
        (op.counterparty && op.counterparty?.name.toLowerCase().includes(searchText)) ||
        (op.description && op.description.toLowerCase().includes(searchText))
      );
    }

    setFilteredOperations(result);
  };

  const performReversal = async (operationId: string) => {
    setLoading(true);
    try {
      await ReverseService.reverseById(operationId);
      if (selectedOperation?.type === 'DEPOSIT') {
        updateBalance(-selectedOperation.amount);
      } else if (selectedOperation?.type === 'TRANSFER') {
        updateBalance(selectedOperation.amount);
      }

      setOperations(prev => prev.map(op =>
        op.id === operationId ? { ...op, status: 'REVERSED', reversible: false } : op
      ));
      setFilteredOperations(prev => prev.map(op =>
        op.id === operationId ? { ...op, status: 'REVERSED', reversible: false } : op
      ));
      toast.success("Operação revertida com sucesso", {
        description: "A operação foi revertida com sucesso.",
      });

    } catch (err) {
      let errorMessage = "Ocorreu um erro inesperado";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erro inesperado", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      render: (counterparty: User) => counterparty?.name || '-',
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
            onClick={() => showModal(record)}
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

      <Modal
        title="Confirmar Reversão"
        open={modalVisible}
        onOk={handleConfirmReversal}
        onCancel={handleCancelReversal}
        okText="Confirmar"
        cancelText="Cancelar"
        confirmLoading={loading}
      >
        <p>Tem certeza que deseja reverter esta operação? Esta ação não pode ser desfeita.</p>
      </Modal>

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