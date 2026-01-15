import React from 'react';
import styled from 'styled-components';
import { IRepoType } from '@/types/IRepoType.ts';

const CardContainer = styled.div`
  background-color: var(--bg-elevated);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const RepoName = styled.h3`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const RepoDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0 0 15px 0;
  line-height: 1.5;
`;

interface SimpleRepoCardProps {
  repo: IRepoType;
}

/**
 * Simple GitHub repository card component
 * Only shows name and description for simplicity
 */
const SimpleRepoCard: React.FC<SimpleRepoCardProps> = ({ repo }) => {
  const handleClick = () => {
    window.open(repo.html_url, '_blank', 'noopener noreferrer');
  };

  return (
    <CardContainer onClick={handleClick}>
      <RepoName>{repo.name}</RepoName>
      {repo.description && <RepoDescription>{repo.description}</RepoDescription>}
    </CardContainer>
  );
};

export default SimpleRepoCard;