import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import styled from 'styled-components';

import PageHeader from '#/common/PageHeader.tsx';

const { Password } = Input;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`;

const CardContainer = styled(Card)`
  margin-top: var(--spacing-xl);
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
`;

const Title = styled.h2`
  text-align: center;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const Description = styled.p`
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
`;

const InternalPage = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const storedPasswordHash = '67f7a520c162bb6fdd336889e2eb5b7659223ae0219319eeb3b6286dfb4f2aac';
  const storedEncryptedUrl = 'U2FsdGVkX19scB8VsTGImdqA17+tawnFKfS3OxSKCMtAq976HZBikCnNMK/37P91';

  const handleSubmit = async () => {
    if (!password) {
      message.warning(t('请输入密码'));
      return;
    }

    setLoading(true);

    try {
      // 1. 验证密码：计算输入密码的哈希并与存储的哈希比对
      const inputPasswordHash = CryptoJS.SHA256(password).toString();
      
      if (inputPasswordHash !== storedPasswordHash) {
        message.error(t('密码错误，请重试'));
        return;
      }
      
      // 2. 密码验证通过后，用密码解密内部链接
      const bytes = CryptoJS.AES.decrypt(storedEncryptedUrl, password);
      const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);
      
      // 3. 验证解密结果是否为有效URL
      if (!decryptedUrl || !decryptedUrl.startsWith('http')) {
        message.error(t('链接解密失败'));
        return;
      }
      
      // 4. 执行跳转
      window.location.href = decryptedUrl;
    } catch (error) {
      message.error(t('处理失败，请重试'));
      console.error('Decryption error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        headerTextArray={[t('内部资料')]}
        subHeaderContentArray={[
          <span key="description">{t('输入密码以访问内部资料')}</span>
        ]}
      />
      <Container>
        <CardContainer>
          <FormContainer>
            <Title>{t('内部资料访问')}</Title>
            <Description>{t('请输入访问密码，验证通过后将自动跳转到内部资料页面')}</Description>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('请输入密码')}
              onPressEnter={handleSubmit}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              block
            >
              {t('访问')}
            </Button>
          </FormContainer>
        </CardContainer>
      </Container>
    </>
  );
};

export default InternalPage;