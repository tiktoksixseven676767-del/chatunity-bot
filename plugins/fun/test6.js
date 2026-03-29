        // Invia miniatura e info
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        // API di download (usando l'URL codificato)
        const downloadUrl = `https://api.lolhuman.xyz/api/ytplay?apikey=GataDios&query=${encodeURIComponent(url)}`

        try {
            const res = await fetch(downloadUrl)
            const json = await res.json()

            // DEBUG: Stampa la risposta esatta nel terminale Termux
            console.log('Risposta API Lolhuman:', json)

            // Controlla se la richiesta è andata a buon fine
            if (json.status === 200 && json.result && json.result.audio) {
                
                await conn.sendMessage(m.chat, {
                    audio: { url: json.result.audio },
                    mimetype: 'audio/mp4',
                    fileName: `${title}.mp3`
                }, { quoted: m })

                // Reazione di successo
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

            } else {
                // Estrapola il messaggio di errore direttamente dall'API (se presente)
                const apiError = json.message || 'Risposta non valida dal server'
                throw new Error(apiError)
            }

        } catch (e) {
            console.error(e)
            
            // Manda l'errore specifico su WhatsApp per capire subito il problema
            m.reply(`❗ Errore durante il recupero dell'audio.\n*Motivo:* ${e.message}`)
            
            // Reazione di errore
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        }
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt)$/i

export default handler
