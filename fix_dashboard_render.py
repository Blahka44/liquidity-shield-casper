with open("dashboard.html", "r") as f:
    content = f.read()

# Find and replace the renderAudit function
old_start = "        function renderAudit(logs) {"
old_end = "        async function init() {"

new_function = '''        function renderAudit(logs) {
            const logsArray = Array.isArray(logs) ? logs : [];
            const count = logsArray.length;
            document.getElementById('audit-count').textContent = count + ' event' + (count !== 1 ? 's' : '');
            if (count === 0) {
                document.getElementById('audit-content').innerHTML = '<div class="error">No audit records found. Run the agent to generate transactions.</div>';
                return;
            }
            const rows = logsArray.slice().reverse().slice(0, 20).map(function(log) {
                const status = log.state || log.status || 'SAFE';
                const isActive = status === 'ACTIVE' || status === 'CRITICAL';
                const actionDisplay = log.last_action || log.action || log.metadata?.action || 'Monitoring';
                let priceChange = log.price_change || log.price_change_24h || log.metadata?.priceChange;
                if (!priceChange && log.reason) {
                    const match = log.reason.match(/change:\\s*([-\\d.]+)%/);
                    if (match) priceChange = match[1];
                }
                priceChange = priceChange || '0.00';
                const riskScore = log.risk_score !== undefined ? log.risk_score : (log.riskScore !== undefined ? log.riskScore : (log.metadata?.factors ? Math.round((log.metadata.factors.base || 0) + (log.metadata.factors.volatility || 0) + (log.metadata.factors.trend || 0)) : 0));
                const txHash = log.tx_hash || log.hash || log.transactionHash || '';
                const badgeClass = getStatusBadgeClass(status);
                const hashDisplay = txHash ?
                    safeSlice(txHash, 0, 12) + '...' + safeSlice(txHash, -8) :
                    'N/A';
                const hashLink = txHash ?
                    'https://testnet.cspr.live/transaction/' + txHash :
                    '#';

                return '<tr>' +
                    '<td>' + formatTime(log.timestamp) + '</td>' +
                    '<td><span class="badge ' + badgeClass + '">' +
                        '<span class="status-dot ' + (isActive ? 'red' : 'green') + '" style="width:6px;height:6px;"></span>' +
                        status +
                    '</span></td>' +
                    '<td>' + actionDisplay + '</td>' +
                    '<td class="risk-badge ' + getRiskClass(riskScore) + '">' + riskScore + '/100</td>' +
                    '<td>' + priceChange + '%</td>' +
                    '<td>' + (txHash ? '<a class="tx-hash" href="' + hashLink + '" target="_blank" rel="noopener">' + hashDisplay + '</a>' : 'N/A') + '</td>' +
                '</tr>';
            }).join('');
            document.getElementById('audit-content').innerHTML =
                '<div style="overflow-x: auto;">' +
                    '<table class="audit-table">' +
                        '<thead><tr><th>Time</th><th>State</th><th>Action</th><th>Risk</th><th>Change</th><th>Transaction</th></tr></thead>' +
                        '<tbody>' + rows + '</tbody>' +
                    '</table>' +
                '</div>';
        }
        async function init() {'''

start_idx = content.find(old_start)
end_idx = content.find(old_end)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_function + content[end_idx + len(old_end) - len("        async function init() {"):]
    with open("dashboard.html", "w") as f:
        f.write(content)
    print("Dashboard renderAudit function updated!")
else:
    print("Could not find function boundaries. Manual edit needed.")
    print("Start found:", start_idx != -1)
    print("End found:", end_idx != -1)
