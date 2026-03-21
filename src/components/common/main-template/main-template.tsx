
import clsx from 'clsx';

function MainTemplate({
  children,
  minHeight = false,
  headerAnimation = true,
  headerConent = null
}: {
  children: React.ReactNode;
  minHeight?: boolean;
  headerAnimation?: boolean;
  headerConent?: React.ReactNode | null;
}) {
  return (
    <main className={clsx('main', minHeight && 'bg-grey')}>

      {children}
    </main>
  );
}

export default MainTemplate;
