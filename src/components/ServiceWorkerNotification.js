import { useEffect, useState } from 'react';
import { Button, Alert, Snackbar } from '@mui/material';

import { register as registerSW } from '../utils/serviceWorkerRegistration';

const ServiceWorkerNotification = () => {
  const [showReload, setShowReload] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sw, setSW] = useState();

  const handleClose = () => {
    setShowSuccess(false);
  };

  const updateServiceWorker = () => {
    const registrationWaiting = sw.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          setShowReload(false);
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    registerSW({
      onSuccess: () => setShowSuccess(true),
      onUpdate: sw => {
        setShowReload(true);
        setSW(sw);
      },
    });
  }, []);

  return (
    <>
      <Snackbar
        open={showReload}
        message="MToolkit新版本已就绪！"
        key='update'
        onClick={updateServiceWorker}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={updateServiceWorker}
          >
            更新
          </Button>
        }
      />
      <Snackbar
        open={showSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
        key='success'
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          MToolkit离线版本已就绪！
        </Alert>
      </Snackbar>
    </>
  );
}

export default ServiceWorkerNotification;