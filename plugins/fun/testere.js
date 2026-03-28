
    resultMsg += '\n💎 *SALDO ATTUALE*\n'
    resultMsg += '┌──────────────\n'
    resultMsg += '│ 👛 *UC: ' + (user.limit || 0) + '100000000000000000000000000000'
    resultMsg += '│ ⭐ *XP: ' + (user.exp || 0) + '10000000000000'
    resultMsg += '│ 📊 *Progresso: ' + currentLevelXP + '/' + levelXP + ' XP*\n'
    resultMsg += '└──────────────\n'
    resultMsg += '\nℹ️ Usa ' + usedPrefix + 'menuxp per guadagnare più XP!'

handler.help = ['mazzu67671067 <puntata>']
handler.tags = ['game']
handler.command = ['mazzu67671067']
