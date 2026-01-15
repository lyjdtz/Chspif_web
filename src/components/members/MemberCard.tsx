import { Card, Col, Row } from 'antd';
import styled, { css } from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import useAnimateOnScroll from '@/hooks/useAnimateOnScroll.ts';
import { IMember } from '@/types/IMember.ts';
import { fadeIn } from '@/styles/animation.ts';

const AvatarImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const StyledCard = styled(Card)<{ $fadeIn: boolean }>`
  opacity: 0;
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-lg) !important;
  transition: all var(--transition-base) !important;
  padding: 8px !important;
  min-height: 120px;

  &:hover {
    border-color: var(--color-primary) !important;
    box-shadow: var(--shadow-md) !important;
  }

  .ant-card-meta-title {
    color: var(--text-primary) !important;
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-card-body {
    padding: 0 !important;
  }

  ${(props) =>
    props.$fadeIn &&
    css`
      animation: ${fadeIn} 0.8s ease-out forwards;
    `};
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 8px;
`;

const MemberCard = ({
  member,
  searchMode,
}: {
  member: IMember;
  searchMode: boolean;
}) => {
  const { animate, ref } = useAnimateOnScroll();

  const avatarUrl = `/static-data/images/${member.avatar}`;

  return (
    <StyledCard ref={ref} $fadeIn={animate || searchMode}>
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <ImageWrapper>
            <AvatarImage
              src={avatarUrl}
              alt={member.name + ' avatar'}
              effect='blur'
            />
          </ImageWrapper>
        </Col>
        <Col span={12}>
          <TextWrapper>
            <Card.Meta title={member.name} />
          </TextWrapper>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default MemberCard;
