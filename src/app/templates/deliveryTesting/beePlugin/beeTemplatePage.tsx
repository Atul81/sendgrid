import React, {useEffect, useState} from "react";
// @ts-ignore
import BeePlugin from "@mailupinc/bee-plugin";
import "./beeTemplate.scss";

const defaultConfig = {
    autosave: true,
    language: "en-US",
    trackChanges: true,
    preventClose: true
};

const clientConfig = {
    clientId: "17111f3f-4d37-4481-a191-902bfc756d05",
    clientSecret: "z7NhPSVC3rRfdmD7nfvwyBY1PBCSKr3Syx2DZDLzkPzKBCfK9aWc",
    uid: "17111f3f-4d37-4481-a191-902bfc756d05"
};

export const BeeTemplatePage = (props: any) => {
    const container = "bee-plugin-container";
    const template = "https://pre-bee-utils.getbee.info/api/templates/m-bee";
    const [fetching, setFetching] = useState(false);
    const {uid, clientId, clientSecret} = clientConfig;
    const editorFonts = {
        showDefaultFonts: true,
        customFonts: [
            {
                name: "Comic Sans MS",
                fontFamily: "'Comic Sans MS', cursive, sans-serif"
            },
            {
                name: "Indie Flower",
                fontFamily: "'Indie Flower', cursive",
                url: "https://fonts.googleapis.com/css?family=Indie+Flower"
            }
        ]
    };
    const beeConfiguration = {
        uid: uid,
        container: container,
        ...defaultConfig,
        font: editorFonts,
        rowsConfiguration: {
            emptyRows: true,
            defaultRows: true
        },
        onSave: (jsonFile: any, htmlFile: any) => {
            console.log('onSave', jsonFile, htmlFile)
        },
        onSaveAsTemplate: (jsonFile: any) => {
            console.log('onSaveAsTemplate', jsonFile)
        },
        onSend: (htmlFile: any) => {
            console.log('onSend', htmlFile)
        },
        onError: (errorMessage: any) => {
            console.log('onError ', errorMessage)
        }
    };

    const beeInstance = new BeePlugin();

    const init = () => {
        setFetching(true);
        fetch(template).then(response => {
            response.json().then(template => {
                beeInstance && beeInstance.getToken(clientId, clientSecret).then(() => {
                    beeInstance && beeInstance.start(beeConfiguration, template);
                    console.log("start");
                });
            });
        });
    };
    useEffect(() => {
        !fetching && init();
        console.log(props);
    }, [props]);

    return <div className="beePluginContainer" id="bee-plugin-container"/>
};
