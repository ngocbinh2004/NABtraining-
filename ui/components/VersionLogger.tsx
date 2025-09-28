import { useEffect } from 'react';

export default function VersionLogger() {
  useEffect(() => {
    const version = process.env.NEXT_PUBLIC_APP_VERSION || 'development';
    console.log(
      `%c App Version: ${version} `,
      'background: #0D47A1; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
    );
  }, []);
  return null;
}
