import styles from './Embeds.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleSubheader } from '../module-subheader';
import { ItemList } from '../item-list';
import { ModuleSection } from '../module-section';
import { Input } from '@/components/input';
import { useEffect, useRef, useState } from 'react';
import { Embed } from '@/components/embed';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import { useGuildId } from '@/hooks/useGuildId';
import Image from 'next/image';
import { useAppSelector } from '@/redux/store';
import { selectChannelById } from '@/redux/dashboard/selectors';
import { Checkbox } from '@/components/checkbox';
import { Embed as EmbedType } from '@/types';
import { BinIcon } from '@/assets/icons/BinIcon';
import { CirclePicker, SketchPicker } from 'react-color';
import { BrushIcon } from '@/assets/icons/BrushIcon';

const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    
    const suffix = hours > 12 ? 'PM' : 'AM';

    if(hours > 12) hours -= 12;

    return `${hours}:${minutes} ${suffix}`
}

const getEmptyField = () => ({
    name: '',
    value: '',
    inline: false
})
const getEmptyEmbed: () => EmbedType = () => ({
    description: '',
    title: '',
    url: '',
    image: '',
    thumbnail: '',
    color: '000',
    author: {
        text: '',
        icon: ''
    },
    footer: {
        text: '',
        icon: ''
    },
    fields: [ getEmptyField() ]
})

export const Embeds: NextPageWithLayout = () => {
    const { post } = useAuth();
    const guildId = useGuildId();

    const [embed, setEmbed] = useState(getEmptyEmbed());
    const [channelId, setChannelId] = useState<null | string>(null);
    const [selectingColor, setSelectingColor] = useState(false);
    
    const colorPicker = useRef(null);

    const channel = useAppSelector(state => selectChannelById(state, guildId, channelId as string))

    // Closing color picker on click outside
    useEffect(() => {
        if(!selectingColor) return;
        
        const checkForClickOutside = (e: MouseEvent) => {
            // @ts-ignore: this works
            if(colorPicker.current && !colorPicker.current.contains(e.target)) {
                setSelectingColor(false);
            }
        }
        document.addEventListener('mousedown', checkForClickOutside);
        return () => document.removeEventListener('mousedown', checkForClickOutside);
    }, [selectingColor]);

    const updateEmbedProperty = (property: keyof ReturnType<typeof getEmptyEmbed>, value: any) => {
        setEmbed(prev => ({...prev, [property]: value}));
    }
    const updateNestedProperty = (property: 'author' | 'footer', nestedProperty: 'text' | 'icon', value: any) => {
        setEmbed(prev => {
            const newEmbed = {...embed};
            newEmbed[property] = {
                ...newEmbed[property],
                [nestedProperty]: value
            }

            return newEmbed;
        })
    }
    const updateEmbedField = (index: number, property: 'name' | 'value' | 'inline', value: any) => {
        setEmbed(prev => {
            const newEmbed = {...embed};
            newEmbed.fields = newEmbed.fields.map((field, key) => {
                if(key === index) {
                    return {
                        ...field,
                        [property]: value
                    }
                }
                return field;
            })
            return newEmbed;
        })
    }
    const addField = () => setEmbed(prev => ({...prev, fields: prev.fields.concat(getEmptyField())}))
    const removeField = (index: number) => {
        setEmbed(prev => {
            const embed = {...prev};

            // If trying to remove last field, just reset its values
            if(embed.fields.length === 1) {
                embed.fields = [getEmptyField()];
                return embed;
            }

            // Else just remove the field
            embed.fields = embed.fields.filter((field, key) => key !== index);
            return embed;
        });
    }

    const sendEmbed = () => {
        if(!channelId) return;

        // Checking if embed has properties
        let isEmpty = true;
        const checkIsEmpty = (variable: Object | string) => {
            if(variable instanceof Object) {
                Object.values(variable).forEach(variable => {
                    checkIsEmpty(variable);
                })
                return;
            }
            if(variable) isEmpty = false;
        }
        const tempEmbed = {...embed};
        tempEmbed.color = '';
        checkIsEmpty(tempEmbed);
        
        if(isEmpty) return;

        // Converting embed color to hexadecimal
        let color = embed.color;
        if(color) {
            color = parseInt(color.replace(/^#/, ''), 16) as any;
        }

        // Sending embed
        post(`/guilds/${guildId}/embeds`, {
            channel_id: channelId,
            embed: JSON.stringify({...embed, ...{ color }})
        })
    }

    return(
        <>
        <ModuleSection 
            description={'Send a custom-made embed in any channel you would like.'}
            header={'Embed Messages'}
        >
            <div>
                <ModuleSubheader extraHeader={'Select the channel you want to send the embed in.'}>
                    Embed Channel
                </ModuleSubheader>
                <ItemList 
                    onChange={setChannelId} 
                />
            </div>
            <div className={styles['main']}>
                <div>
                    <div className={`${styles['flex']} ${styles['section']}`}>
                        <div>
                            <span className={styles['header']}>
                                Author text
                            </span>
                            <Input 
                                onChange={text => updateNestedProperty('author', 'text', text)}
                                placeholder={'Author text'}
                            />
                        </div>
                        <div>
                            <span className={styles['header']}>
                                Author icon
                            </span>
                            <Input 
                                onChange={text => updateNestedProperty('author', 'icon', text)}
                                placeholder={'Author icon url'}
                            />
                        </div>
                    </div>

                    <div className={`${styles['flex']} ${styles['section']}`}>
                        <div>
                            <span className={styles['header']}>
                                Title
                            </span>
                            <Input 
                                onChange={text => updateEmbedProperty('title', text)}
                                placeholder={'Title'}
                            />
                        </div>
                        <div>
                            <span className={styles['header']}>
                                URL
                            </span>
                            <Input 
                                onChange={text => updateEmbedProperty('url', text)}
                                placeholder={'Url'}
                            />
                        </div>
                    </div>

                    <div className={styles['section']}>
                        <span className={styles['header']}>
                            Description
                        </span>
                        <Input 
                            onChange={text => updateEmbedProperty('description', text)}
                            placeholder={'Description'}
                            textArea
                        />
                    </div>

                    <div className={styles['section']}>
                        <span className={styles['header']}>
                            Fields
                        </span>
                        
                        <div className={styles['fields']}>
                            {embed.fields.map((field, index) => (
                                <div className={styles['flex']}>
                                    <Input 
                                        placeholder={'Name'}
                                        onChange={text => updateEmbedField(index, 'name', text)}
                                        defaultValue={embed.fields[index].name}
                                    />
                                    <Input 
                                        placeholder={'Value'}
                                        onChange={text => updateEmbedField(index, 'value', text)}
                                        defaultValue={embed.fields[index].value}
                                    />
                                    <div className={styles['checkbox']}>
                                        Inline?
                                        <Checkbox 
                                            onChange={state => updateEmbedField(index, 'inline', state)}
                                            defaultChecked={embed.fields[index].inline}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => removeField(index)}
                                        aria-label={'Remove field'}
                                    >
                                        <BinIcon />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={addField}
                            className={styles['add-field']}
                        >
                            Add field
                        </button>
                    </div>

                    <div className={`${styles['flex']} ${styles['section']}`}>
                        <div>
                            <span className={styles['header']}>
                                Footer text
                            </span>
                            <Input 
                                onChange={text => updateNestedProperty('footer', 'text', text)}
                                placeholder={'Footer text'}
                            />
                        </div>
                        <div>
                            <span className={styles['header']}>
                                Footer icon
                            </span>
                            <Input 
                                onChange={text => updateNestedProperty('footer', 'icon', text)}
                                placeholder={'Footer icon url'}
                            />
                        </div>
                    </div>

                    <div className={`${styles['flex']} ${styles['section']}`}>
                        <div>
                            <span className={styles['header']}>
                                Thumbnail
                            </span>
                            <Input 
                                onChange={text => updateEmbedProperty('thumbnail', text)}
                                placeholder={'Thumbnail url'}
                            />
                        </div>
                        <div>
                            <span className={styles['header']}>
                                Image
                            </span>
                            <Input 
                                onChange={text => updateEmbedProperty('image', text)}
                                placeholder={'Image url'}
                            />
                        </div>
                    </div>

                    <div className={`${styles['flex']} ${styles['section']}`}>
                        <div>
                            <span className={styles['header']}>
                                Color
                            </span>
                            <div className={styles['colors']}>
                                <button 
                                    className={styles['color-toggle']}
                                    onClick={() => setSelectingColor(!selectingColor)}
                                    aria-label={'Select color'}
                                >
                                    <BrushIcon />
                                </button>
                                {selectingColor && (
                                    <div 
                                        className={styles['sketch-picker']}
                                        ref={colorPicker}
                                    >
                                        <SketchPicker 
                                            color={embed.color}
                                            onChange={color => updateEmbedProperty('color', color.hex)}
                                        />
                                    </div>
                                )}
                                <CirclePicker 
                                    className={styles['circle-picker']} 
                                    color={embed.color}
                                    onChange={color => updateEmbedProperty('color', color.hex)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles['send-button']}>
                        <Button 
                            onClick={sendEmbed}
                            disabled={!channelId}
                        >
                            Send Embed
                        </Button>
                    </div>
                </div>
                <div>
                    <ModuleSubheader>
                        Preview
                    </ModuleSubheader>

                    <div className={styles['preview']}>
                        <span className={styles['preview-channel']}>
                            # {channel?.name || 'channel-not-selected'}
                        </span>
                        <div className={styles['preview-main']}>
                            <Image 
                                className={styles['preview-avatar']}
                                src="/avatars/onixo.png"
                                width={38}
                                height={38}
                                alt=""
                            />

                            <div>
                                <span className={styles['preview-name']}>
                                    Onixo 
                                    <span className={styles['bot-badge']}>bot</span> 
                                    <span className={styles['preview-timestamp']}>Today at {getCurrentTime()}</span>
                                </span>
                                <Embed {...embed} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModuleSection>
        </>
    )
}

Embeds.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)