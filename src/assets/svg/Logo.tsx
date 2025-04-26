export default function Logo() {
  const logoSrc = '/logo.svg';
  return (
    <img src={logoSrc} alt="Logo" style={{ height: '40px', width: 'auto' }} />
  );
}
