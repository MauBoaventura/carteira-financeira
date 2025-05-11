'use client'
import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from '@/hooks/use-location';
import { DepositService } from "@/services/deposit";
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const { Title, Text } = Typography;
const { Option } = Select;

const depositSchema = z.object({
  amount: z.number({
    required_error: "Valor é obrigatório",
    invalid_type_error: "Digite um valor numérico"
  }).min(10, "Valor mínimo é R$ 10,00")
    .max(10000, "Valor máximo é R$ 10.000,00"),
  bank: z.string().min(1, "Selecione um banco"),
  accountType: z.enum(["CHECKING", "SAVINGS"], {
    required_error: "Selecione o tipo de conta",
  }),
  reference: z.string().optional(),
});

type DepositFormData = z.infer<typeof depositSchema>;

const DepositPage = () => {
  const { userRole } = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      accountType: "CHECKING"
    }
  });

  const onSubmit = async (data: DepositFormData) => {
    try {
      const response = await DepositService.deposit(data);
      toast.success("Depósito realizado com sucesso!", {
        description: `Depósito de R$ ${response.data.deposit.amount.toFixed(2)} realizado com sucesso!`,
      });
      reset();
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

  const banks = [
    { code: "001", name: "Banco do Brasil" },
    { code: "033", name: "Santander" },
    { code: "237", name: "Bradesco" },
    { code: "341", name: "Itaú" },
    { code: "104", name: "Caixa Econômica Federal" },
  ];
  return (
    <div className="p-6 bg-white rounded-lg">
      <Title level={3}>Depósito Bancário</Title>
      <Text type="secondary">Realize depósitos em sua conta</Text>

      <Card style={{ marginTop: 24, maxWidth: 600 }}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Campo Valor */}
          <Form.Item
            label="Valor do Depósito (R$)"
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
                  min="10"
                  max="10000"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 150,50"
                />
              )}
            />
          </Form.Item>

          {/* Campo Banco */}
          <Form.Item
            label="Banco"
            validateStatus={errors.bank ? "error" : ""}
            help={errors.bank?.message}
          >
            <Controller
              name="bank"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Selecione seu banco">
                  {banks.map(bank => (
                    <Option key={bank.code} value={bank.code}>
                      {bank.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Campo Tipo de Conta */}
          <Form.Item
            label="Tipo de Conta"
            validateStatus={errors.accountType ? "error" : ""}
            help={errors.accountType?.message}
          >
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <Option value="CHECKING">Conta Corrente</Option>
                  <Option value="SAVINGS">Conta Poupança</Option>
                </Select>
              )}
            />
          </Form.Item>

          {/* Campo Referência (Opcional) */}
          <Form.Item
            label="Referência (Opcional)"
            validateStatus={errors.reference ? "error" : ""}
            help={errors.reference?.message}
          >
            <Controller
              name="reference"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Depósito salário" />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Confirmar Depósito
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default DepositPage;