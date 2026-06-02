import styled from 'styled-components';

const Card = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const SkeletonLine = styled.div<{ $width?: string; $height?: string; $marginBottom?: string }>`
  background: ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '16px'};
  margin-bottom: ${({ $marginBottom }) => $marginBottom || '8px'};
`;

export default function SkeletonCard() {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <SkeletonLine $width="70%" $height="18px" $marginBottom="8px" />
          <SkeletonLine $width="45%" $height="14px" />
        </div>
        <SkeletonLine $width="24px" $height="24px" />
      </div>
      <SkeletonLine $width="80px" $height="20px" $marginBottom="0" style={{ marginTop: 12 }} />
    </Card>
  );
}
