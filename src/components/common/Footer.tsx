import React from 'react';
import { Row, Col, Space } from 'antd';
import { GithubOutlined, BilibiliOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { serverLink } from '@/constants';
import chspif_banner from '@/assets/brand/brand.webp';
import logo from '@/assets/logo/base.webp';
import { useTranslation } from 'react-i18next';

const FooterContainer = styled.footer`
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
`;

const TopFooterContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding: 60px 80px;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const BottomFooterContainer = styled.div`
  position: relative;
  background: var(--bg-tertiary);
  padding: 20px 80px;

  /* Subtle top border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-color-strong),
      transparent
    );
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const Copyright = styled.div`
  color: var(--text-tertiary);
  user-select: none;
  font-size: 0.875rem;
`;

const Donate = styled.a`
  color: var(--color-primary);
  font-weight: 500;
  transition: all var(--transition-base);

  &:hover {
    color: var(--color-primary-hover);
  }
`;

const BrandImageWrapper = styled.div`
  max-width: 250px;

  & > span > img {
    width: 100%;
    filter: brightness(0) invert(0.3);
    transition: filter var(--transition-base);
  }

  [data-theme='dark'] & > span > img {
    filter: brightness(0) invert(0.8);
  }

  &:hover > span > img {
    filter: brightness(0) invert(0.5);
  }

  [data-theme='dark'] &:hover > span > img {
    filter: brightness(0) invert(1);
  }
`;

const LogoImageWrapper = styled.div`
  width: 70px;

  @media (max-width: 768px) {
    display: none;
  }

  & > span > img {
    width: 70px;
  }
`;

const SocialIcon = styled.a`
  color: var(--text-tertiary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);

  &:hover {
    color: var(--color-primary);
    transform: translateY(-3px);
    background: var(--color-primary-light);
    border-color: var(--color-primary);
    box-shadow: var(--glow-primary);
  }

  .anticon {
    font-size: 20px;
  }
`;

const TopRow = styled(Row)`
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const BottomRow = styled(Row)`
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: transform var(--transition-base);

  &:hover {
    transform: scale(1.02);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLinkTitle = styled.span`
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: var(--spacing-xs);
`;

const FooterLink = styled(Link)`
  color: var(--text-tertiary);
  font-size: 0.875rem;
  transition: color var(--transition-base);

  &:hover {
    color: var(--color-primary);
  }
`;

/**
 * Modern Footer component with theme-aware styling.
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterContainer>
      <TopFooterContainer>
        <TopRow>
          <Col>
            <BrandLink to='/' onClick={() => setTimeout(scrollToTop, 500)}>
              <LogoImageWrapper>
                <LazyLoadImage src={logo} alt='chspif' effect='blur' />
              </LogoImageWrapper>
              <BrandImageWrapper>
                <LazyLoadImage src={chspif_banner} alt='chspif' effect='blur' />
              </BrandImageWrapper>
            </BrandLink>
          </Col>

          <FooterLinks>
            <FooterLinkGroup>
              <FooterLinkTitle>{t('menu.memberAndWork')}</FooterLinkTitle>
              <FooterLink to='/member/'>{t('menu.member')}</FooterLink>
            </FooterLinkGroup>
            <FooterLinkGroup>
              <FooterLinkTitle>Links</FooterLinkTitle>
              <FooterLink to='/join/'>{t('menu.join')}</FooterLink>
            </FooterLinkGroup>
          </FooterLinks>

          <Col>
            <Space size='middle'>
              <SocialIcon
                href={serverLink.github}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='GitHub'
              >
                <GithubOutlined />
              </SocialIcon>
              <SocialIcon
                href={serverLink.bilibili}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Bilibili'
              >
                <BilibiliOutlined />
              </SocialIcon>
            </Space>
          </Col>
        </TopRow>
      </TopFooterContainer>
      <BottomFooterContainer>
        <BottomRow>
          <Col>
            <Copyright>
              © {new Date().getFullYear()} Chspif. All Rights Reserved.
            </Copyright>
          </Col>
        </BottomRow>
      </BottomFooterContainer>
    </FooterContainer>
  );
};

export default Footer;
