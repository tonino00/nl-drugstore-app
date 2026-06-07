import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { BarcodeScanner as ZxingScanner } from '@thewirv/react-barcode-scanner';
import toast from 'react-hot-toast';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    margin: 0 16px;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.grayDark};
`;

const ScannerArea = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background: #000;
  aspect-ratio: 4 / 3;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Reticle = styled.div`
  position: absolute;
  inset: 18% 12%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25);
  pointer-events: none;
`;

const Hint = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.grayDark};
  text-align: center;
`;

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
  title?: string;
}

// O backend aceita apenas códigos de 8 a 14 dígitos numéricos
const isValidBarcode = (code: string) => /^\d{8,14}$/.test(code);

// Exceções de decodificação do ZXing disparadas a cada quadro sem código — devem ser ignoradas
const DECODE_ERRORS = ['NotFoundException', 'ChecksumException', 'FormatException'];

export default function BarcodeScanner({
  onDetected,
  onClose,
  title = 'Ler código de barras',
}: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const handledRef = useRef(false);

  const handleSuccess = useCallback(
    (text: string) => {
      if (handledRef.current) return;
      const code = text.replace(/\D/g, '');
      if (!isValidBarcode(code)) {
        toast.error('Código inválido (esperado 8 a 14 dígitos)');
        return;
      }
      handledRef.current = true;
      setScanning(false);
      onDetected(code);
    },
    [onDetected]
  );

  const handleError = useCallback((e?: Error) => {
    if (!e || DECODE_ERRORS.includes(e.name)) return;
    toast.error('Não foi possível acessar a câmera');
  }, []);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseBtn type="button" onClick={onClose} aria-label="Fechar">
            ✕
          </CloseBtn>
        </Header>

        <ScannerArea>
          <ZxingScanner
            doScan={scanning}
            constraints={{ facingMode: 'environment' }}
            onSuccess={handleSuccess}
            onError={handleError}
            containerStyle={{ width: '100%', height: '100%' }}
            videoContainerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Reticle />
        </ScannerArea>

        <Hint>Aponte a câmera para o código de barras do medicamento.</Hint>
      </Modal>
    </Overlay>
  );
}
