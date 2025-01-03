const asar = require('@electron/asar')
const path = require('path')
const fs = require('fs')


function extractAppArchive(version, override = false) {
    const archive = path.resolve(__dirname, `../resources/app/${version}/app.asar`)
    const dest = path.resolve(__dirname, `../src/app/v${version}`)

    if (!fs.existsSync(archive)) {
        throw new Error(`app-v${version}.asar file not exist in resources directory.`)
    }

    // 检查目标是否存在，如果存在需要提示
    if (fs.existsSync(dest) && !override) {
        throw new Error(`${dest} already exist, please remove it if you want continue, or use '--override' option`)
    }

    asar.extractAll(archive, dest)
}

/**
 * 处理命令
 * @param cmd
 * @param version
 * @param extra
 * @return {Promise<void>}
 */
async function handleCommand(cmd, version, extra) {
    switch (cmd) {
        case 'extract:app':
            extractAppArchive(version, extra === '--override')
            break
        default:
            throw new Error(`not supported command: ${command}`)
    }
}


const [command, version, extra] = process.argv.slice(2)
if (!command || !version) {
    console.log(`usage:\n  [command] [version]`)
    process.exit(1)
}
void (async () => {
    try {
        await handleCommand(command, version, extra)
    } catch (e) {
        console.warn(e.message)
        process.exit(1)
    }
})()
