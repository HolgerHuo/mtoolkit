import React, { useEffect, useState } from "react";

import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, Snackbar, Alert, Chip, Typography, NativeSelect, Stack } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { getLS } from '../utils/localStorageWrapper';
import { trackEvent } from '../utils/analyticsWrapper';

import './StiUI.css'

const appPrefix = 'STI';

const classData = [[1, "1班"], [2, "2班"], [3, "3班"], [4, "4班"], [5, "5班"], [6, "6班"]]

const subData = [
    [1, "A"], [2, "B"], [3, "C"], [4, "D"], [5, "E"]
]

const o1Data = [[1, "物理1(秦夏)"], [2, "政治2(邢志辉)"], [3, "物理2(高永生)"], [4, "化学1(李莹)"], [5, "地理3(王楠)"]]

const o2Data = [[1, "物理3(秦夏)"], [2, "政治1(王健颖)"], [3, "化学2(李莹)"], [4, "生物2(杨力)"], [5, "历史3(樊颖)"]]

const o3Data = [[1, "生物1(张颖)"], [2, "地理1(王楠)"], [3, "历史2(李素香)"], [4, "历史1(樊颖)"], [5, "地理2(王慧)"], [6, "政治3(王健颖)"]]


function Selector(props) {
    const handleChange = (e) => {
        props.callback(e.target.value);
    };

    return (
        <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id={props.id}>{props.name}</InputLabel>
            <Select
                labelId={props.id}
                id={props.id}
                value={props.value}
                label={props.name}
                onChange={handleChange}
            >
                {props.data.map(i => <MenuItem key={i[0]} value={i[0]}>{i[1]}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

function NativeSelector(props) {
    const handleChange = (e) => {
        props.callback(e.target.value);
    };

    return (
        <FormControl sx={props.sx}>
            <InputLabel variant="standard" id={props.id}>
                {props.name}
            </InputLabel>
            <NativeSelect
                id={props.id}
                value={props.value}
                onChange={handleChange}
            >
                {props.data.map(i => <option key={i[0]} value={i[0]}>{i[1]}</option>)}
            </NativeSelect>
        </FormControl>
    )
}

// main ui component
export default function StiUI() {

    const [c, setC] = useState(1);
    const [s, setS] = useState(1);
    const [o1, setO1] = useState(1);
    const [o2, setO2] = useState(1);
    const [o3, setO3] = useState(1);

    const [notification, setNotification] = useState(0);

    const handleClose = () => {
        setNotification(false);
    };

    const copyFocus = (e) => {
        try {
            navigator.clipboard.writeText(e.target.value);
            setNotification(1);
        } catch (error) {
            setNotification(0);
            console.debug('error: ', error);
        } finally {
            e.target.select();
        }
    };

    return (
        <Grid item xs={12}>

            <Snackbar
                open={notification === 1}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleClose}
                key='success'
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    已成功复制到剪贴板！(微信中无法复制且无法检测)
                </Alert>
            </Snackbar>

            <Stack direction="row" spacing={2} sx={{ marginLeft: 1.5, marginRight: 2.5, marginBottom: 2 }}>
                <NativeSelector value={c} sx={{ width: '65%' }} callback={setC} id='class' name='班级' data={classData}></NativeSelector>
                <NativeSelector value={s} sx={{ width: '35%' }} callback={setS} id='sub' name='小班' data={subData}></NativeSelector>
            </Stack>

            <Grid container spacing={2} sx={{ marginTop: 3, paddingRight: 3 }}>
                <Grid item xs={12} md={4}>
                    <Selector value={o1} callback={setO1} id='sub' name='走班1' data={o1Data}></Selector>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Selector value={o2} callback={setO2} id='sub' name='走班2' data={o2Data}></Selector>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Selector value={o3} callback={setO3} id='sub' name='走班3' data={o3Data}></Selector>
                </Grid>

            </Grid>

            <Grid sx={{ margin: 2, lineHeight: 2 }}>
                <FormControl fullWidth sx={{ paddingRight: 1 }} variant="standard">
                    <TextField
                        label='订阅链接(点击即可复制)'
                        id="subscription"
                        onFocus={copyFocus}
                        value={`https://sti.r669.live/tfls/g3/${c}/schedule.ics?opt1=${o1}&opt2=${o2}&opt3=${o3}&sub-class=${s}`}
                        variant="standard"
                        inputProps={{ readOnly: true }}
                    />
                </FormControl>
                <Chip icon={<HelpOutlineIcon />} size="small" label="如何使用" variant="outlined" sx={{ marginBottom: 2, marginTop: 3 }} />
                <Typography style={{ fontWeight: 600, marginTop: 2 }}>
                    苹果系(macOS, iOS)
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                    点击<a onClick={() => { trackEvent('sti', 'apple') }} target='_blank' href={`https://sti.r669.live/tfls/g3/${c}/schedule.ics?opt1=${o1}&opt2=${o2}&opt3=${o3}&sub-class=${s}`}>此链接</a>并在打开的应用中完成订阅。
                </Typography>
                <Typography style={{ fontWeight: 600, marginTop: 2 }}>
                    其它安卓设备
                </Typography>
                <Typography>
                    复制上方链接，<a href='https://f-droid.org/repo/at.bitfire.icsdroid_62.apk' onClick={() => { trackEvent('sti', 'icsx5') }} target='_blank'>下载</a>并安装ICSx⁵，在ICSx⁵中选择新建订阅并粘贴入链接，记得修改一下日历名称噢！
                </Typography>
                <Typography sx={{ color: 'gray', fontSize: 'small' }}>
                    ICSx⁵是开源软件，其源代码位于<a href='https://github.com/bitfireAT/icsx5' onClick={() => { trackEvent('sti', 'apple') }} target='_blank'>GitHub</a>
                </Typography>
            </Grid>
        </Grid>
    );
}