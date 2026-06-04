import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => `linear-gradient(135deg, #0d7377 0%, #14a085 50%, #2e7d32 100%)`};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 25px 30px -5px rgba(0, 0, 0, 0.15),
      0 15px 15px -5px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6f7f1, #d4f1e8);
  color: #0d7377;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #d4f1e8, #c0eadc);
  }

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
    font-size: 1.75rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.1rem;
  transition: color 0.2s ease;
`;

export const Field = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;

  &:focus {
    border-color: #0d7377;
    box-shadow: 0 0 0 3px rgba(13, 115, 119, 0.1);
    transform: translateY(-1px);
  }

  &:focus + ${InputIcon} {
    color: #0d7377;
  }

  &:hover {
    border-color: #d1d5db;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    padding: 10px 14px 10px 44px;
    font-size: 0.95rem;
  }
`;

export const Error = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d7377, #14a085);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #0a5f63, #119080);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(13, 115, 119, 0.3);
  }

  &:hover:before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    background: linear-gradient(135deg, #6b7280, #9ca3af);
  }

  ${({ $loading }) =>
    $loading &&
    `
    pointer-events: none;
    
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
`;

export const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: #6b7280;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #0d7377;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #0d7377;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  @media (max-width: 480px) {
    margin-top: ${({ theme }) => theme.spacing.md};
    font-size: 0.8rem;
  }
`;

export const SuccessMessage = styled.div`
  background: #10b981;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
