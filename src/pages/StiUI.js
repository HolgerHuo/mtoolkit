import React, { useEffect, useState } from "react";

import { FormControl, InputLabel, Select, MenuItem, Grid, Chip, Typography, Stack, Divider, Link, Alert, Snackbar } from '@mui/material';
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

    function isNotif() {
        if (/Android/i.test(window.navigator.userAgent) && /MicroMessenger/i.test(window.navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }

    const [notification, setNotification] = useState(isNotif());

    const handleClose = () => {
        setNotification(false);
    };

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

    const isAllSub = c => {
        if (localStorage.STI_c && (localStorage.STI_c === '2' || localStorage.STI_c === '5')) {
            return true;
        }

        return [2, 5].includes(c);
    }

    return (
        <>
            <Snackbar
                open={notification}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                onClose={handleClose}
                key='false'
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    你正在使用Android微信浏览，可能会无法跳转，请右上角选择浏览器打开！
                </Alert>
            </Snackbar>
            <Grid item xs={12}>
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
                    <FormControl fullWidth sx={{ paddingRight: 0.7 }}>
                        <Typography>订阅链接</Typography>
                        <Link className='result-sti' href={`webcal://sti.r669.live/tfls/g3/${c}/G3.${c}.ics?opt1=${o1}&opt2=${o2}&opt3=${o3}&sub-class=${s}`} target="_blank" rel="noopener" color="inherit">{`webcal://sti.r669.live/tfls/g3/${c}/G3.${c}.ics?opt1=${o1}&opt2=${o2}&opt3=${o3}&sub-class=${s}`}</Link>
                    </FormControl>
                    <Chip icon={<HelpOutlineIcon />} size="small" label="如何使用" variant="outlined" sx={{ marginBottom: 2, marginTop: 3 }} />
                    <Typography style={{ fontWeight: 700, marginTop: 2, fontSize: 'large', marginBottom: 4 }}>
                        苹果系(macOS/iOS)、小米(MIUI)
                    </Typography>
                    <Typography>
                        点击上方链接并在弹出的应用中完成订阅。
                    </Typography>
                    <Typography style={{ fontWeight: 700, marginTop: 7, marginBottom: 4, fontSize: 'large' }}>
                        其他安卓手机(含鸿蒙)
                    </Typography>
                    <Typography>
                        <a href='https://f-droid.org/repo/at.bitfire.icsdroid_62.apk' onClick={() => { trackEvent({ action: 'click', target: 'icsx5-fdroid', page: 'sti' }, 'icsx5- fdroid') }} target='_blank' rel="noreferrer" >下载并安装ICSx⁵</a>，随后返回重新点击上方链接。
                    </Typography>
                    <Typography sx={{ pt: 0.7, color: 'gray', fontSize: 'small' }}>
                        ICSx⁵是开源软件(GPL-3.0)，其源代码位于<a href='https://github.com/bitfireAT/icsx5' onClick={() => { trackEvent({ action: 'click', target: 'icsx5-src', page: 'sti' }, 'icsx5-src') }} target='_blank' rel="noreferrer" >GitHub</a>
                    </Typography>
                    <Typography sx={{ marginTop: 1, marginBottom: 1, fontSize: 'small' }}>
                        如果下载速度过慢可以使用以下链接:<br /> <a href='https://bj-cn-1-cdn.weblogcomm.ltd/static/apks/at.bitfire.icsdroid_62.apk.zip' onClick={() => { trackEvent({ action: 'click', target: 'icsx5-dccdn-bj', page: 'sti' }, 'icsx5-dccdn-bj') }} target='_blank' rel="noreferrer" >国内加速</a>/<a href='https://cdn.dragoncloud.win/static/apks/at.bitfire.icsdroid_62.apk.zip' onClick={() => { trackEvent({ action: 'click', target: 'icsx5-dccdn-cf', page: 'sti' }, 'icsx5-dccdn-cf') }} target='_blank' rel="noreferrer" >全球加速</a>(CloudFlare)
                    </Typography>
                    <Typography sx={{ marginTop: 1, marginBottom: 1, color: 'gray', fontSize: 'small' }}>
                        (华为手机如无法安装ICSx⁵请<a href='https://developer.huawei.com/consumer/cn/forum/topic/0203581985638000413?fid=26' onClick={() => { trackEvent({ action: 'click', target: 'Harmony OS disable pure mode', page: 'sti' }, 'HOS') }} target='_blank' rel="noreferrer" >关闭纯净模式</a>)
                    </Typography>
                    <Typography style={{ fontWeight: 700, marginTop: 2, fontSize: 'large', marginBottom: 4 }}>
                        其他设备
                    </Typography>
                    <Typography sx={{ paddingBottom: 2 }}>
                        请自行搜索<a href='https://www.baidu.com/s?wd=如何订阅iCal日历' onClick={() => { trackEvent({ action: 'click', target: 'baidu-search-how-to-use-ics', page: 'sti' }) }} target='_blank' rel="noreferrer" >如何订阅iCal日历</a>。
                    </Typography>
                    <Divider />
                    <Typography sx={{ color: 'gray', paddingTop: 2 }} className='footer'>
                        由<a href='https://github.com/HolgerHuo/schedule-to-ics' onClick={() => { trackEvent({ action: 'click', target: 'sti-src', page: 'sti' }, 'sti-src') }} target='_blank' rel="noreferrer" >schedule-to-ics</a>强力驱动。
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
}