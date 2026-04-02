  // ... (resto del codice sopra invariato)

  const hasPolice = users[targetId].polizia === true; // Controlla se la vittima ha la protezione
  let quantitaFinale = quantita;

  if (hasPolice) {
    quantitaFinale = Math.floor(quantita / 2); // Se ha la polizia, rubi solo il 50%
  }

  switch (esito) {
    case 0: // Successo
      users[senderId].limit += quantitaFinale;
      users[targetId].limit = Math.max(0, users[targetId].limit - quantitaFinale);

      await conn.sendMessage(m.chat, { 
        react: { text: hasPolice ? '👮‍♂️' : '💰', key: m.key }
      });

      let msgSuccesso = global.t('robSuccess', userId, groupId, {
          amount: formatNumber(quantitaFinale),
          target: targetId.split("@")[0]
      });
      
      if (hasPolice) msgSuccesso += `\n\n🛡️ *Protezione Polizia:* La vittima ha salvato il 50% del bottino!`;

      await conn.sendMessage(m.chat, {
        text: msgSuccesso,
        buttons: buttons,
        footer: 'ChatUnity RPG',
        mentions: [targetId]
      }, { quoted: m });
      break;

    // ... (Case 1: Catturato resta uguale)

    case 2: // Parziale
      let parziale = Math.min(Math.floor(Math.random() * (users[targetId].limit / 2 - minRubare + 1)) + minRubare, maxRubare);
      if (hasPolice) parziale = Math.floor(parziale / 2); // Riduzione 50%
      
      users[senderId].limit += parziale;
      users[targetId].limit = Math.max(0, users[targetId].limit - parziale);

      await conn.sendMessage(m.chat, { 
        react: { text: '💸', key: m.key }
      });

      let msgParziale = global.t('robPartial', userId, groupId, {
          amount: formatNumber(parziale),
          target: targetId.split("@")[0]
      });

      if (hasPolice) msgParziale += `\n\n🛡️ *Intervento Polizia:* Il furto è stato limitato!`;

      await conn.sendMessage(m.chat, {
        text: msgParziale,
        buttons: buttons,
        footer: 'ChatUnity RPG',
        mentions: [targetId]
      }, { quoted: m });
      break;
  }
  // ... (resto del codice sotto invariato)
