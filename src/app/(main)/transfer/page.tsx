'use client'
import React, { useMemo } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Spin, Avatar, Skeleton, Space, Tag } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from '@/hooks/use-location';
import { SearchOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { TransferService } from '@/services/transfer';
import { UserService } from '@/services/user';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { Option } = Select;

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
};

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


const TransferPage = () => {
  const [searching, setSearching] = React.useState(false);
  const [recipientOptions, setRecipientOptions] = React.useState<User[]>([]);
  const [currentBalance, setCurrentBalance] = React.useState(0);
  const [loadingBalance, setLoadingBalance] = React.useState(true);
  const [loadingRecipients, setLoadingRecipients] = React.useState(true);
  const [selectedRecipient, setSelectedRecipient] = React.useState<User | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema)
  });

  const amount = watch("amount", 0);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getAll();
        setRecipientOptions(response.data.filter(user => user.id !== JSON.parse(Cookies.get('user') || '{}').id));
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error("Erro ao carregar a lista de usuários");
      } finally {
        setLoadingRecipients(false);
      }
    };

    const fetchBalance = async () => {
      try {
        const user = JSON.parse(Cookies.get('user') || '{}');

        if (user.id) {
          const response = await UserService.getById({ id: user.id });
          setCurrentBalance(response.data.balance);
        } else {
          toast.error("ID do usuário não encontrado no cookie");
        }
      } catch (error) {
        toast.error("Erro ao carregar o saldo do usuário");
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchUsers();
    fetchBalance();
  }, []);

  const onSubmit = async (data: TransferFormData) => {
    try {
      const response = await TransferService.tranfer({
        amount: data.amount,
        recipientId: data.recipient,
        description: data.description,
      });
      setCurrentBalance(prev => prev - data.amount);
      toast.success("Transferência realizada com sucesso!", {
        description: `Transferência de R$ ${response.data.amount.toFixed(2)} realizada com sucesso!`,
      });
      reset();
      setSelectedRecipient(null);
    } catch (err) {
      let errorMessage = "Ocorreu um erro inesperado";
      console.error(err);
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erro inesperado", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <Title level={3}>Transferência entre Usuários</Title>
      <Text type="secondary">Envie dinheiro para outros usuários do sistema</Text>
      <div className="my-6 p-4 bg-gray-100 rounded-lg">
        <Text strong>Saldo disponível: </Text>
        {loadingBalance ? (
          <Skeleton.Input active style={{ width: 40, height: 24 }} />
        ) : (
          <Text className="text-lg text-blue-500">
            R$ {currentBalance.toFixed(2)}
          </Text>
        )}
      </div>

      <Card style={{ marginTop: 16, maxWidth: 600 }}>
        {loadingRecipients ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
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
              name="recipient"
              rules={[{ required: true, message: 'Selecione um destinatário' }]}
              validateStatus={errors.recipient ? "error" : ""}
              help={errors.recipient?.message}
            >
              <Select
                showSearch
                placeholder="Digite para buscar destinatário"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  const recipient = recipientOptions.find(c => c.id === value);
                  setSelectedRecipient(recipient || null);
                  setValue('recipient', value);
                }}
                options={recipientOptions.map(user => ({
                  value: user.id,
                  label: (
                    <Space>
                      <Avatar size="small" src={user.avatar} icon={<UserOutlined />} />
                      <span>{user.name}</span>
                      {user.phone && <Tag>{user.phone}</Tag>}
                      <Tag>{user.email}</Tag>
                    </Space>
                  ),
                }))}
              />
            </Form.Item>

            {selectedRecipient && (
              <div className="bg-muted p-4 rounded-lg mb-4">
                <Space direction="vertical">
                  <Space>
                    <Avatar size="large" src={selectedRecipient.avatar} icon={<UserOutlined />} />
                    <div>
                      <h4>{selectedRecipient.name}</h4>
                      {selectedRecipient.phone && <p><PhoneOutlined /> {selectedRecipient.phone}</p>}
                      <p>{selectedRecipient.email}</p>
                    </div>
                  </Space>
                </Space>
              </div>
            )}

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
        )}
      </Card>
    </div>
  );
}

export default TransferPage;