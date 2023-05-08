import { GreetTileOne } from "@/assets/tiles/GreetTileOne";
import { GreetTileThree } from "@/assets/tiles/GreetTileThree";
import { GreetTileTwo } from "@/assets/tiles/GreetTileTwo";
import { ModTileOne } from "@/assets/tiles/ModTileOne"
import { ModTileThree } from "@/assets/tiles/ModTileThree";
import { ModTileTwo } from "@/assets/tiles/ModTileTwo";
import { LoggingTileOne } from "@/assets/tiles/LoggingTileOne";
import { LoggingTileTwo } from "@/assets/tiles/LoggingTileTwo";
import { LoggingTileThree } from "@/assets/tiles/LoggingTileThree";
import { TodosTileOne } from "@/assets/tiles/TodosTileOne";
import { TodosTileTwo } from "@/assets/tiles/TodosTileTwo";
import { TodosTileThree } from "@/assets/tiles/TodosTileThree";
import { SettingsTileOne } from "@/assets/tiles/SettingsTileOne";
import { SettingsTileTwo } from "@/assets/tiles/SettingsTileTwo";

export const getTileImage = (id: string, index: number) => {
    if(id === 'moderation') {
        if(index === 0) return <ModTileOne />;
        if(index === 1) return <ModTileTwo />;
        if(index === 2) return <ModTileThree />;
    }
    if(id === 'greetings') {
        if(index === 0) return <GreetTileOne />;
        if(index === 1) return <GreetTileTwo />;
        if(index === 2) return <GreetTileThree />;
    }
    if(id === 'logging') {
        if(index === 0) return <LoggingTileOne />;
        if(index === 1) return <LoggingTileTwo />;
        if(index === 2) return <LoggingTileThree />;
    }
    if(id === 'todos') {
        if(index === 0) return <TodosTileOne />;
        if(index === 1) return <TodosTileTwo />;
        if(index === 2) return <TodosTileThree />;
    }
    if(id === 'settings') {
        if(index === 0) return <SettingsTileOne />;
        if(index === 1) return <SettingsTileTwo />;
    }
}