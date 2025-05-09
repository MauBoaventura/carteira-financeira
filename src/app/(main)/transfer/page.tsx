'use client'
import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Spin, Avatar } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from '@/hooks/use-location';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Schema de validação com Zod
const transferSchema = z.object({
  amount: z.number({
    required_error: "Valor é obrigatório",
    invalid_type_error: "Digite um valor numérico"
  }).min(1, "Valor mínimo é R$ 1,00")
    .max(5000, "Valor máximo é R$ 5.000,00"),
  recipient: z.string().min(1, "Selecione um destinatário"),
  description: z.string().max(100, "Máximo de 100 caracteres").optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

// Mock de dados - substitua por chamadas à API real
const mockUsers = [
  { id: '1', name: 'João Silva', email: 'joao@exemplo.com', avatar: null },
  { id: '2', name: 'Maria Souza', email: 'maria@exemplo.com', avatar: null },
  { id: '3', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', avatar: null },
];

const mockBalance = 1500.00; // Saldo mockado - substitua por chamada à API

const TransferPage = () => {
  const [searching, setSearching] = React.useState(false);
  const [recipientOptions, setRecipientOptions] = React.useState(mockUsers);
  const [currentBalance, setCurrentBalance] = React.useState(mockBalance);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema)
  });

  const amount = watch("amount", 0);

  const handleSearch = (value: string) => {
    setSearching(true);
    // Simula busca na API
    setTimeout(() => {
      const filtered = mockUsers.filter(user => 
        user.name.toLowerCase().includes(value.toLowerCase()) || 
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setRecipientOptions(filtered);
      setSearching(false);
    }, 500);
  };

  const onSubmit = async (data: TransferFormData) => {
    // Validação de saldo
    if (data.amount > currentBalance) {
      message.error("Saldo insuficiente para realizar a transferência");
      return;
    }

    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza saldo (em uma aplicação real, isso viria da API)
      setCurrentBalance(prev => prev - data.amount);
      
      message.success(`Transferência de R$ ${data.amount.toFixed(2)} realizada com sucesso!`);
      reset();
    } catch (error) {
      message.error("Ocorreu um erro ao processar a transferência");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <Title level={3}>Transferência entre Usuários</Title>
      <Text type="secondary">Envie dinheiro para outros usuários do sistema</Text>
      <div className="my-6 p-4 bg-gray-100 rounded-lg">
        <Text strong>Saldo disponível: </Text>
        <Text className="text-lg text-blue-500">
          R$ {currentBalance.toFixed(2)}
        </Text>
      </div>

      <Card style={{ marginTop: 16, maxWidth: 600 }}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Campo Valor */}
          <Form.Item
            label="Valor da Transferência (R$)"
            validateStatus={errors.amount ? "error" : ""}
            help={errors.amount?.message}
          >
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="1"
                  max="5000"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 150,50"
                />
              )}
            />
            {amount > 0 && amount > currentBalance && (
              <Text type="danger" style={{ display: 'block', marginTop: '4px' }}>
                Saldo insuficiente
              </Text>
            )}
          </Form.Item>

          {/* Campo Destinatário */}
          <Form.Item
            label="Destinatário"
            validateStatus={errors.recipient ? "error" : ""}
            help={errors.recipient?.message}
          >
            <Controller
              name="recipient"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Busque por nome ou email"
                  defaultActiveFirstOption={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  notFoundContent={searching ? <Spin size="small" /> : null}
                  optionFilterProp="children"
                >
                  {recipientOptions.map(user => (
                    <Option key={user.id} value={user.id}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.avatar} 
                          icon={<UserOutlined />} 
                          size="small" 
                          style={{ marginRight: '8px' }}
                        />
                        <div>
                          <div>{user.name}</div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{user.email}</Text>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Campo Descrição (Opcional) */}
          <Form.Item
            label="Descrição (Opcional)"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="Ex: Pagamento pelo serviço prestado"
                  maxLength={100}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={isSubmitting}
              disabled={amount > currentBalance}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Transferência'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default TransferPage;