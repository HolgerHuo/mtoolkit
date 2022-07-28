import React, { useEffect, useState } from "react";

import { Grid, TextField, FormControlLabel, Checkbox, InputAdornment, IconButton, Button, Divider, Stack } from '@mui/material';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import autoFocus from '../utils/autoFocus'
import { getLS } from '../utils/localStorageWrapper'
import DoughnutChart from '../components/DoughnutChart';
import ProgressCircle from '../components/ProgressCircle'

import './CheckList.css'

const appPrefix = 'CL'

// main functional function
function gotYou(data) {

    // variables in this function
    let matchRule
    let optionsText = '', missingText = ''
    let iListArray = [], fListArray = [], opts = []

    // variables to be returned as result
    let options = []
    let matchError = false, missing = false
    let matchHelp = '自定义匹配规则'
    let text = ''
    let progress = null, chart = null

    if (data.match.match(/(%)(?!result|name).*/gi) === null) {
        // generate match rule
        const regex = new RegExp('([^%]*)(%name|%result)([^%]*)(%name|%result)?(.*)', 'gi')
        regex.lastIndex = 0
        matchRule = regex.exec(data.match)
    } else {
        matchRule = null
        matchError = true
        matchHelp = (<>请删除除匹配词以外以%开头的内容！<br />匹配词: %name:姓名 %result:结果 smart: 智能模式<br />(至少包含 %name)<br />错误匹配将使用默认规则(智能模式)！</>)
    }


    if (matchRule !== null && matchRule[2] === '%result' && matchRule[4] === undefined) {
        matchRule = null
    }

    if (matchRule === null && data.match.trim() !== 'smart' && matchError === false) {
        matchError = true
        matchHelp = (<>无法解析匹配规则！<br />匹配词: %name:姓名 %result:结果 smart: 智能模式<br />(至少包含 %name)<br />错误匹配将使用默认规则(智能模式)！</>)
    }

    // pre-check and format input data
    if (data.fList.trim() !== '') {
        fListArray = data.fList.trim().replace(/(，|,|、)/g, '\n').split(/\r?\n/).map(i => i.trim());
    } else if (matchRule === null || data.match.trim() === 'smart') { // return as no result could be given
        return ({
            matchError: matchError,
            missing: missing,
            options: options,
            matchHelp: matchHelp,
            text: text,
            graphs: {
                progress: progress,
                chart: chart,
            },
        })
    }

    if (data.iList.trim() === '') { // also return as no input
        return ({
            matchError: matchError,
            missing: missing,
            options: options,
            matchHelp: matchHelp,
            text: text,
            graphs: {
                progress: progress,
                chart: chart,
            },
        })
    }

    try {
        iListArray = data.iList.match(/([1-9][0-9]*\. )(.*?)(?=([\d]+\.)|($))/gm).map(i => i.slice(i.indexOf('.') + 2).trim())
    } catch (e) {
        iListArray = data.iList.replace(/(，|,|、)/g, '\n').trim().split(/\r?\n/).map(i => i.trim());
        console.error("Input List: '" + data.iList + "' is not a valid wechat check-in list. Will be separated by line")
    }

    // parse rules
    const smartParse = i => {
        let item = [i, null]
        fListArray.forEach(name => {
            if (i.includes(name)) {
                let option
                if (i.indexOf(name) !== 0 || i.indexOf(name) + name.length !== i.length) {
                    const optionPre = i.indexOf(name) !== 0 ? i.slice(0, i.indexOf(name)).trim() : ''
                    const optionSuf = i.indexOf(name) + name.length !== i.length ? i.slice(i.indexOf(name) + name.length).trim() : ''
                    option = optionPre + optionSuf
                } else {
                    option = null
                }
                item = [name, option]
            }
        })
        return item
    }
    const matchParse = i => {
        let prefix = matchRule[1];
        let middle = matchRule[3];
        let suffix = matchRule[4] === undefined ? matchRule[3] : matchRule[5]; // to tell if match rule contains %result section
        let prefixL = prefix === '' ? 0 : prefix.length;
        let suffixL = suffix === '' ? i.length : -suffix.length;
        let item = i.slice(prefixL, suffixL);

        if (matchRule[4] === undefined) {
            return [item.trim(), null] // return for %name only rule
        }

        if (!item.includes(middle)) { // match rule incorrect
            matchError = true;
            matchHelp = '有接龙不符合匹配规则，其已被忽略，可选择手动改正接龙。';
            return smartParse(item.trim())
        }

        item = matchRule[2] === '%name' ? item.split(middle) : item.split(middle).reverse();
        return item.map(i => i.trim())
    }

    // parse iListArray
    if (data.match.trim() === 'smart' || matchRule === null) { // use smart match mode
        iListArray = iListArray.map(i => smartParse(i))
    } else {
        iListArray = iListArray.map(i => matchParse(i))
    }

    // aggregate options with students
    opts = iListArray.map(i => i[1]).filter((value, index, self) => { // find all unique options
        return self.indexOf(value) === index
    })
    if (!(opts.length === 1 && opts[0] === null)) {
        opts.forEach((o, index) => { // tba: remove options when all options cannot be matched
            if (!(o === null && (matchRule !== null && (matchRule[2] === '%name' || matchRule[4] === undefined)))) {
                const option = o === null ? '无法匹配' : o
                options[index] = { [option]: [] }
                iListArray.forEach(stu => {
                    if (stu[1] === o) {
                        options[index][option].push(stu[0])
                    }
                })
            }
        })
    }

    // find who didn't engage in check-in
    if (fListArray.length > 0) {
        missing = []
        fListArray.forEach(stu => {
            if (!iListArray.map(i => i[0]).includes(stu)) {
                missing.push(stu)
            }
        });
    }

    // generate text result and graphs
    if (options.length > 0) {
        optionsText = options.map(opt => Object.keys(opt)[0] + ': ' + opt[Object.keys(opt)[0]].join('、')).join('\n')
        chart = <DoughnutChart data={{ labels: options.map(o => Object.keys(o)[0]), data: options.map(o => o[Object.keys(o)[0]].length) }} />
    }
    if (missing !== false) {
        missingText = options.length > 0 ? missing.join('、') + ' 没有接龙' : '全部接龙';
        progress = {
            endAdornment: (
                <InputAdornment position="end" sx={{ position: 'absolute', top: 30, right: 15 }}>
                    <ProgressCircle value={100 - missing.length / fListArray.length * 100} />
                </InputAdornment>
            ),
        }
    }

    text = [missingText, optionsText].join('\n').trim()

    return ({
        matchError: matchError,
        missing: missing,
        options: options,
        matchHelp: matchHelp,
        text: text,
        graphs: {
            progress: progress,
            chart: chart,
        },
    })
}

// main ui component
export default function CheckList() {

    // setup variables
    // ui settings
    const [advancedOptions, setAdvancedOptions] = useState(false)
    // data to be consumed
    const [fList, setFList] = useState('')
    const [iList, setIList] = useState('')
    const [match, setMatch] = useState('smart')
    // result for rendering
    const [result, setResult] = useState({ missing: [], options: [], matchError: false, matchHelp: '自定义匹配规则', text: '', graphs: { progress: {}, chart: {} } })

    // load data from localStorage
    useEffect(() => {
        const initialData = [['fList', fList, setFList], ['iList', iList, setIList], ['match', match, setMatch], ['advancedOptions', advancedOptions, setAdvancedOptions]]

        const savedData = getLS(initialData, appPrefix)
        savedData.forEach((i, index) => {
            if (i[1] !== initialData[index][1]) {
                i[2](i[1])
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // sideeffect on data change (delayed 300ms)
    useEffect(() => {
        const delayedCalc = setTimeout(() => {
            setResult(gotYou({ fList: fList, iList: iList, match: match }))
        }, 300)

        return () => clearTimeout(delayedCalc) // removed timer
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fList, iList, match]) // on these value change

    // input fields
    const InputField = [
        <Grid item xs={12} sm={6} key={0}>
            <TextField
                id="filled-multiline-flexible"
                label="完整名单"
                name="fList"
                multiline
                className='fList'
                rows={6}
                value={fList}
                onChange={e => {
                    const { value, name } = e.target;
                    localStorage.setItem(appPrefix + '_' + name, value);
                    setFList(value);
                }}
                InputProps={result.progress}
                variant="filled"
                placeholder="张小聋，麻花疼"
                helperText={<>请在此处粘贴完整名单<br />一个一行或使用逗号分隔</>}
                fullWidth={true}
            />
        </Grid>,
        <Grid item xs={12} sm={6} key={1}>
            <TextField
                id="outlined-multiline-static"
                label="微信接龙"
                name='iList'
                multiline
                className='iList'
                rows={6}
                value={iList}
                onChange={e => {
                    const { value, name } = e.target;
                    localStorage.setItem(appPrefix + '_' + name, value);
                    setIList(value);
                }}
                onFocus={autoFocus}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{ position: 'absolute', top: 30, right: 20 }}>
                            <IconButton edge="end" color="primary" disabled={iList === ''} onClick={() => setIList('')}>
                                <PlaylistRemoveIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                placeholder={'#接龙 \n724核酸\n\n1. 张小聋\n2. 麻花疼'}
                helperText="请在此处粘贴微信接龙"
                fullWidth={true}
            />
        </Grid>
    ]

    const AdvancedControls = [
        <Grid item xs={12} className='control-button' key={0}>
            <Button variant="contained" disabled={!result.text} className='copy-button' onClick={() => navigator.clipboard.writeText(result.text)}>复制结果</Button>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={advancedOptions}
                        onChange={() => {
                            localStorage.setItem(appPrefix + '_advancedOptions', !advancedOptions);
                            setAdvancedOptions(!advancedOptions)
                        }}
                    />
                }
                label="高级选项" />
        </Grid>,
        <Grid item xs={12} className='advanced-controls' key={1} sx={advancedOptions ? { display: 'block' } : { display: 'none' }}>
            <Stack direction="row" spacing={2}>
                <TextField id="standard-basic"
                    value={match}
                    label="自定义匹配"
                    name='match'
                    variant="standard"
                    onChange={e => {
                        const { value, name } = e.target;
                        setMatch(value);
                        localStorage.setItem(appPrefix + '_' + name, value);
                    }}
                    placeholder="smart"
                    helperText={result.matchHelp}
                    error={result.matchError}
                />
            </Stack>
        </Grid>
    ]

    const MissingBlock = () => {
        if (result.missing === false) {
            return
        }
        if (result.missing.length > 0) {
            return (
                <Grid item xs={12} className='missing-students' key={0}>
                    {[result.missing.map((i, key) => <span key={key} className='missing-student'>{i} </span>), "没有接龙！"]}
                </Grid>
            )
        } else {
            return <Grid item xs={12} className='missing-students' key={0}>全部接龙！</Grid>
        }
    }
    const OptionsBlock = () => {
        return result.options.map(o => <p key={Object.keys(o)[0]}>{[<span className="option-name" key={0}>{Object.keys(o)[0]}</span>, ': ', o[Object.keys(o)[0]].toString()]}</p>)
    }

    const ResultBlock = [
        <Grid item xs={12} sm={6} className=' result left' key={0}>
            {<MissingBlock />}
            {result.missing !== false && result.options.length > 0 && <Divider variant="middle" />}
            {result.options.length > 0 && <Grid item xs={12} className='options-data' key={1}><OptionsBlock /></Grid>}
        </Grid>,
        <Grid item xs={12} sm={6} className='options-chart result right' key={1}>{result.chart}</Grid>
    ]



    return (

        <Grid container spacing={2} >
            {InputField}
            {AdvancedControls}
            {ResultBlock}
        </Grid>

    )
}