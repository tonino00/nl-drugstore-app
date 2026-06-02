import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrapper = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : 'auto')};
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.grayLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.9s linear infinite;
`;

export default function Loader({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <Wrapper $fullScreen={fullScreen}>
      <Spinner />
    </Wrapper>
  );
}
