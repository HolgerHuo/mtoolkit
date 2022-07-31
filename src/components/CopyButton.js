import { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';

export default function CopyButton(props) {
    const [notification, setNotification] = useState(false);

    const copy = () => {
        try {
            navigator.clipboard.writeText(props.content);
            setNotification(1);
        } catch (e) {
            setNotification(0);
            console.debug('failed to write to clipboard with content: ', props.content);
            console.debug('error: ', e);
        } finally {
            props.callback && props.callback();
        }
    };

    const handleClose = () => {
        setNotification(false);
    };

    return (
        <>
            <Button variant="contained" disabled={props.disabled} className='copy-button' onClick={copy} key='copy'>
                {props.text}
            </Button>
            <Snackbar
                open={notification === 1}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleClose}
                key='success'
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    已成功复制到剪贴板！
                </Alert>
            </Snackbar>
            <Snackbar
                open={notification === 0}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleClose}
                key='false'
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    无法访问剪贴板！请检查你的浏览器设置。
                </Alert>
            </Snackbar>
        </>
    )
}