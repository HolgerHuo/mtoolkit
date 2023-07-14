import { useEffect } from 'react';
import { Typography, Box, Container, Card, CardMedia, CardActionArea, CardContent, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';

import { trackEvent } from '../utils/analyticsWrapper';

import './Entry.css';
import shiwu from '../static/images/shiwu-2nd-edition.png';
import checkListBackground from '../static/images/check-list.png';
import tflsSub from '../static/images/tfls-sub.png';

const tools = [{ name: '微信接龙考勤', path: '/check-list', descriptionText: '一个可以帮你找出谁没有接龙、自动识别出接龙中的选项的小工具', backgroundImg: checkListBackground, imgAlt: 'wechat check-in helper screenshot' }, { name: '订阅TFLS课表', path: '/sti-ui', descriptionText: '快速订阅课表，并为你提供腾讯会议、地点等信息', backgroundImg: tflsSub, imgAlt: 'schedule' }];

function ToolCard() {
    return (
        <Grid container spacing={2} className='tool-card'>
            {tools.map(i => (
                <Grid item xs={12} sm={6} key={i.name}>
                    <Card>
                        <CardActionArea component={Link} to={i.path} onClick={() => trackEvent(i.name, 'click')}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={i.backgroundImg}
                                alt={i.imgAlt}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h7" component="div">
                                    {i.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {i.descriptionText}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            )
            )}
        </Grid>
    )
}

export default function Entry() {

    const day = new Date();
    const time = day.getHours();

    let hitokoto = undefined, greeting = '';
    if ((time >= 0) && (time < 7)) {
        greeting = "是时候休息啦！不要熬夜哦~ ";
    }

    if ((time >= 7) && (time < 12)) {
        greeting = "早上好！祝你度过美好的一天！！";
    }

    if ((time >= 12) && (time < 14)) {
        greeting = "中午时分可以适当放松一下噢~";
    }

    if ((time >= 14) && (time < 18)) {
        greeting = "现在可以回家啦！";
    }

    if ((time >= 18) && (time <= 22)) {
        greeting = "工作之余不要忘记学习噢~";
    }

    if ((time >= 22) && (time < 24)) {
        greeting = "要早一点休息w~";
    }

    useEffect(() => {
        let typed = {};
        fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=j&c=i&c=h&c=f')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(data => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                hitokoto = data.from_who ? '『' + data.hitokoto + '』\n        ——' + data.from_who : '『' + data.hitokoto + '』';
            })
            .catch((error) => {
                console.error('There was an error when fetching Hitokoto API: ', error);
            })
            .finally(
                () => {
                    const strings = hitokoto ? [greeting, hitokoto] : ['暂时无法访问一言API', greeting]
                    const options = {
                        strings: strings,
                        typeSpeed: 50,
                        backSpeed: 55,
                    };
                    typed.current = new Typed('#hitokoto-string', options);
                }
            );

        return () => {
            typed.current && typed.current.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className='content'>
                <Typography variant="h5" component="h5" className='title center'>
                    欢迎来访<span className='pm'>MToolkit</span>!

                </Typography>
                <div id='hitokoto' className='center'>
                    <span id='hitokoto-string' />
                </div>
                <Container className='center'>
                    <Box component='img' src={shiwu} alt='sketch of little cutie' className='shiwu' />
                </Container>
            </div>
            <Divider />
            <ToolCard />
        </>
    );
};