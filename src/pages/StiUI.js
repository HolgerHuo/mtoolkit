import React, { useEffect, useState } from "react";

import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, Snackbar, Alert, Chip, Typography, Stack, Divider } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { getLS } from '../utils/localStorageWrapper';
import { trackEvent } from '../utils/analyticsWrapper';

import './StiUI.css'

const appPrefix = 'STI';

const classData = [[1, "高三1班"], [2, "高三2班"], [3, "高三3班"], [4, "高三4班"], [5, "高三5班"], [6, "高三6班"]]

const o1Data = [[1, "物理1(秦夏)"], [2, "政治2(邢志辉)"], [3, "物理2(高永生)"], [4, "化学1(李莹)"], [5, "地理3(王楠)"]]

const o2Data = [[1, "物理3(秦夏)"], [2, "政治1(王健颖)"], [3, "化学2(李莹)"], [4, "生物2(杨力)"], [5, "历史3(樊颖)"]]

const o3Data = [[1, "生物1(张颖)"], [2, "地理1(王楠)"], [3, "历史2(李素香)"], [4, "历史1(樊颖)"], [5, "地理2(王慧)"], [6, "政治3(王健颖)"]]


const Selector = (props) => {
    const handleChange = (e) => {
        props.callback(e.target.value);
        console.log(e.target)
        localStorage.setItem(appPrefix + '_' + e.target.name, e.target.value);
    };

    return (
        <FormControl variant={props.variant || undefined} sx={{ m: 1, width: '100%', ...props.sx }}>
            <InputLabel variant={props.variant || undefined} id={props.id}>{props.name}</InputLabel>
            <Select
                labelId={props.id}
                id={props.id}
                value={props.value}
                label={props.name}
                onChange={handleChange}
                name={props.id}
            >
                {props.data.map(i => <MenuItem key={i[0]} value={i[0]}>{i[1]}</MenuItem>)}
            </Select>
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

    // load data from localStorage
    useEffect(() => {

        const initialData = [['c', c, setC], ['s', s, setS], ['o1', o1, setO1], ['o2', o2, setO2], ['o3', o3, setO3]];

        const savedData = getLS(initialData, appPrefix);
        savedData.forEach((i, index) => {
            if (i[1] !== initialData[index][1]) {
                i[2](i[1]);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [notification, setNotification] = useState(0);

    const handleClose = () => {
        setNotification(false);
    };

    const isAllSub = c => {
        if (localStorage.STI_c && (localStorage.STI_c === '2' || localStorage.STI_c === '5')){
            return true;
        }

        return [2, 5].includes(c);
    }

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

            <Stack direction="row" sx={{ marginRight: 1, marginBottom: 2, marginLeft: 0.5 }}>
                <Selector value={c} variant='standard' sx={{ width: '65%' }} callback={setC} id='c' name='班级' data={classData}></Selector>
                <Selector value={s} variant='standard' sx={{ width: '35%' }} callback={setS} id='s' name='小班' data={isAllSub(c) ? [[1, "A"], [2, "B"], [3, "C"], [4, "D"], [5, "E"]] : [[1, "A"], [2, "B"]]}></Selector>
            </Stack>

            <Grid container spacing={2} sx={{ marginTop: 3, paddingRight: 3 }}>
                <Grid item xs={12} md={4}>
                    <Selector value={o1} callback={setO1} id='o1' name='走班1' data={o1Data}></Selector>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Selector value={o2} callback={setO2} id='o2' name='走班2' data={o2Data}></Selector>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Selector value={o3} callback={setO3} id='o3' name='走班3' data={o3Data}></Selector>
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
                <Typography style={{ fontWeight: 700, marginTop: 2, fontSize: 'large', marginBottom: 1 }}>
                    苹果系(macOS, iOS)
                </Typography>
                <Typography>
                    复制上方链接，并参考<a onClick={() => { trackEvent('sti', 'macos') }} target='_blank' href='https://support.apple.com/guide/calendar/icl1022/mac'>macOS</a>/<a onClick={() => { trackEvent('sti', 'ios') }} target='_blank' href='https://support.apple.com/guide/iphone/iph3d1110d4/ios'>iOS</a>资料添加订阅。
                </Typography>
                <Typography style={{ fontWeight: 700, marginTop: 2, fontSize: 'large', marginBottom: 1 }}>
                    MIUI(小米手机)
                </Typography>
                <Typography>
                    ①在小米手机自带应用商店内升级“日历”APP至最新版本；<br />
                    ②打开“日历”APP，点击右上角“更多”图标（三个点）；
                    <br />
                    ③点击“设置”；
                    <br />
                    ④点击“日程导入”；
                    <br />
                    ⑤点击“URL导入”；
                    <br />
                    ⑥输入获取到的订阅地址，点击“添加”即可
                </Typography>
                <Typography style={{ fontWeight: 700, marginTop: 5, fontSize: 'large' }}>
                    其它安卓设备(含华为设备)
                </Typography>
                <Typography>
                    复制上方链接，<a href='https://f-droid.org/repo/at.bitfire.icsdroid_62.apk' onClick={() => { trackEvent('sti', 'icsx5') }} target='_blank'>下载</a>并安装ICSx⁵，在ICSx⁵中选择新建订阅并粘贴入链接，记得修改一下日历名称噢！
                </Typography>
                <Typography sx={{ marginTop: 0.3, marginBottom: 0.3 }}>
                    (下载过慢请使用<a href='https://cdn.dragoncloud.win/static/apks/at.bitfire.icsdroid_62.apk.zip' onClick={() => { trackEvent('sti', 'icsx5-dc') }} target='_blank'>镜像链接</a>/华为手机如无法安装ICSx⁵请<a href='https://developer.huawei.com/consumer/cn/forum/topic/0203581985638000413?fid=26' onClick={() => { trackEvent('sti', 'HOS') }} target='_blank'>关闭纯净模式</a>)
                </Typography>
                <Typography sx={{ color: 'gray', fontSize: 'small', paddingBottom: 2 }}>
                    ICSx⁵是开源软件(GPL-3.0)，其源代码位于<a href='https://github.com/bitfireAT/icsx5' onClick={() => { trackEvent('sti', 'apple') }} target='_blank'>GitHub</a>
                </Typography>
                <Divider />
                <Typography sx={{ color: 'gray', paddingTop: 2 }} className='footer'>
                    由<a href='https://github.com/HolgerHuo/schedule-to-ics' onClick={() => { trackEvent('sti-github', 'click') }} target='_blank'>schedule-to-ics</a>强力驱动。
                </Typography>
            </Grid>
        </Grid>
    );
}