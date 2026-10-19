import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from '../../assets/InvoLogo1.png';
import { formatInvoiceDate, formatMoney } from '../../utils/invoice';
import type { InvoiceData, InvoiceTotals } from '../../utils/invoice';

const CONTACT_EMAIL = 'hospedajepordia@hotmail.com';
const CONTACT_PHONE = '+58 416-640-3840';

const INK = '#0f172a';
const MUTED = '#475569';
const LINE = '#cbd5e1';
const ACCENT = '#6b3a2a';
const SOFT = '#f8fafc';

const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingHorizontal: 44, paddingBottom: 70, fontFamily: 'Helvetica', fontSize: 12, color: INK },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 130, height: 108, objectFit: 'contain' },
  headerRight: { alignItems: 'flex-end' },
  title: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1 },
  issued: { marginTop: 6, fontSize: 12, color: MUTED },
  contact: { marginTop: 12, alignItems: 'flex-end' },
  contactLine: { fontSize: 12, marginTop: 3 },
  rule: { borderBottomWidth: 3, borderBottomColor: ACCENT, marginTop: 14, marginBottom: 18 },

  infoBox: { borderWidth: 1, borderColor: LINE, backgroundColor: SOFT, padding: 16, marginBottom: 20 },
  infoRow: { flexDirection: 'row' },
  infoRowGap: { marginTop: 16 },
  cell: { flex: 1, paddingRight: 10 },
  nightsCell: { width: 70 },
  label: { fontSize: 9.5, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 },
  value: { fontSize: 14, fontFamily: 'Helvetica-Bold' },

  tableHead: { flexDirection: 'row', backgroundColor: ACCENT, paddingVertical: 10, paddingHorizontal: 12 },
  headText: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 14, paddingHorizontal: 12 },
  colConcept: { flex: 1, paddingRight: 10 },
  colAmount: { width: 110, textAlign: 'right' },
  concept: { fontSize: 13 },
  detail: { marginTop: 3, fontSize: 10.5, color: MUTED },
  amount: { fontSize: 13, fontFamily: 'Helvetica-Bold' },

  bottomRow: { marginTop: 22, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' },
  summary: { width: 250 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, paddingHorizontal: 12 },
  summaryText: { fontSize: 13 },
  summaryDetail: { fontSize: 10.5, color: MUTED, marginTop: 2 },
  balanceBox: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 13, paddingHorizontal: 14 },
  balanceLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
  balanceValue: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#ffffff' },

  notes: { flex: 1, marginRight: 20, borderWidth: 1, borderColor: LINE, backgroundColor: SOFT, padding: 14 },
  notesText: { fontSize: 11, lineHeight: 1.4 },

  footer: { position: 'absolute', left: 44, right: 44, bottom: 30, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 12, fontSize: 12, fontFamily: 'Helvetica-Bold', color: ACCENT, textAlign: 'center' },
});

interface InvoiceDocumentProps {
  data: InvoiceData;
  totals: InvoiceTotals;
}

export const InvoiceDocument = ({ data, totals }: InvoiceDocumentProps) => {
  const rows: { concept: string; detail?: string; amount: number }[] = [
    {
      concept: 'Alojamiento',
      detail: `${totals.nights} ${totals.nights === 1 ? 'noche' : 'noches'} × ${formatMoney(data.ratePerNight)}`,
      amount: totals.lodging,
    },
  ];
  if (data.adminFee > 0) rows.push({ concept: 'Tarifa administrativa', amount: data.adminFee });
  if (data.cleaningFee > 0) rows.push({ concept: 'Tarifa de limpieza', amount: data.cleaningFee });
  data.extras.forEach((extra) => rows.push({ concept: extra.description, amount: extra.amount }));

  const notes = data.notes.trim();
  // Row spacing adapts to the space left once the totals and notes are accounted for, so the page stays filled but never overflows.
  const noteLines = notes ? notes.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / 38)), 0) : 0;
  const bottomHeight = Math.max(100 + (totals.prepayment > 0 ? 45 : 0), notes ? 50 + noteLines * 15.4 : 0);
  const tableBudget = 363 - bottomHeight;
  const rowPadding = Math.min(22, Math.max(8, Math.floor(((tableBudget - 14) / rows.length - 16) / 2)));

  return (
    <Document title="Recibo de Pago" author="Hospedaje Por Días">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.title}>RECIBO DE PAGO</Text>
            <Text style={styles.issued}>Fecha de emisión: {formatInvoiceDate(data.issuedAt)}</Text>
            <View style={styles.contact}>
              <Text style={styles.contactLine}>{CONTACT_EMAIL}</Text>
              <Text style={styles.contactLine}>{CONTACT_PHONE}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rule} />

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <View style={styles.cell}>
              <Text style={styles.label}>Huésped</Text>
              <Text style={styles.value}>{data.guestName}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.label}>Propiedad</Text>
              <Text style={styles.value}>{data.propertyName}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, styles.infoRowGap]}>
            <View style={styles.cell}>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.value}>{formatInvoiceDate(data.checkIn)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.label}>Check-out</Text>
              <Text style={styles.value}>{formatInvoiceDate(data.checkOut)}</Text>
            </View>
            <View style={styles.nightsCell}>
              <Text style={styles.label}>Noches</Text>
              <Text style={styles.value}>{totals.nights}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.headText, styles.colConcept]}>Concepto</Text>
          <Text style={[styles.headText, styles.colAmount]}>Monto (USD)</Text>
        </View>
        {rows.map((row, index) => (
          <View key={`${row.concept}-${index}`} style={[styles.tableRow, { paddingVertical: rowPadding }]} wrap={false}>
            <View style={styles.colConcept}>
              <Text style={styles.concept}>{row.concept}</Text>
              {row.detail ? <Text style={styles.detail}>{row.detail}</Text> : null}
            </View>
            <Text style={[styles.amount, styles.colAmount]}>{formatMoney(row.amount)}</Text>
          </View>
        ))}

        <View style={styles.bottomRow}>
          {notes ? (
            <View style={styles.notes}>
              <Text style={styles.label}>Notas</Text>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          ) : null}
          <View style={styles.summary} wrap={false}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total</Text>
              <Text style={styles.summaryText}>{formatMoney(totals.total)}</Text>
            </View>
            {totals.prepayment > 0 ? (
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryText}>Abono recibido</Text>
                  {data.prepaymentDate ? <Text style={styles.summaryDetail}>Recibido el {formatInvoiceDate(data.prepaymentDate)}</Text> : null}
                </View>
                <Text style={styles.summaryText}>-{formatMoney(totals.prepayment)}</Text>
              </View>
            ) : null}
            <View style={styles.balanceBox}>
              <Text style={styles.balanceLabel}>{totals.prepayment > 0 ? 'Saldo a pagar' : 'Total a pagar'}</Text>
              <Text style={styles.balanceValue}>{formatMoney(totals.balance)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>Hospedaje Por Días</Text>
      </Page>
    </Document>
  );
};
