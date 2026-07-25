with open("dashboard.html", "r") as f:
    content = f.read()

# Fix the row rendering to handle both old and new audit log formats
old_render = '''                const status = log.state || log.status || 'SAFE';
                const isActive = status === 'ACTIVE' || status === 'CRITICAL';
                const actionDisplay = log.last_action || log.action || 'Monitoring';
                const priceChange = log.price_change || log.price_change_24h || '0.00';
                const txHash = log.tx_hash || log.hash || '';'''

new_render = '''                // Handle both old format and new event-sourced format
                const status = log.state || log.status || 'SAFE';
                const isActive = status === 'ACTIVE' || status === 'CRITICAL';
                const actionDisplay = log.last_action || log.action || log.metadata?.action || 'Monitoring';
                const priceChange = log.price_change || log.price_change_24h || log.metadata?.priceChange || '0.00';
                const riskScore = log.risk_score || log.riskScore || (log.metadata?.factors ? Math.round((log.metadata.factors.base || 0) + (log.metadata.factors.volatility || 0) + (log.metadata.factors.trend || 0)) : 0);
                const txHash = log.tx_hash || log.hash || log.transactionHash || '';'''

content = content.replace(old_render, new_render)

# Also fix the risk score display in the table row
old_risk = '''                    '<td class="risk-badge ' + getRiskClass(log.risk_score) + '">' + (log.risk_score || 0) + '/100</td>\\' +'''

new_risk = '''                    '<td class="risk-badge ' + getRiskClass(riskScore) + '">' + riskScore + '/100</td>\\' +'''

content = content.replace(old_risk, new_risk)

with open("dashboard.html", "w") as f:
    f.write(content)

print("Dashboard format fix applied!")
