import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from '../../assets/InvoLogo1.png';
import { formatInvoiceDate, formatMoney } from '../../utils/invoice';
import type { InvoiceData, InvoiceTotals } from '../../utils/invoice';

const INK = '#0f172a';
const MUTED = '#64748b';
const LINE = '#e2e8f0';
const ACCENT = '#6b3a2a';

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 10, color: INK },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  logo: { width: 110, height: 90, objectFit: 'contain' },
  headerRight: { alignItems: 'flex-end' },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1 },
  subtitle: { marginTop: 4, fontSize: 9, color: MUTED },
  rule: { borderBottomWidth: 2, borderBottomColor: ACCENT, marginBottom: 20 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  infoCell: { width: '50%', marginBottom: 12, paddingRight: 12 },
  label: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  value: { fontSize: 11 },
  tableHead: { flexDirection: 'row', backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 8, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 9, paddingHorizontal: 8 },
  headText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUTED, textTransform: 'uppercase', letterSpacing: 1 },
  colConcept: { flex: 1, paddingRight: 8 },
  colAmount: { width: 90, textAlign: 'right' },
  detail: { marginTop: 2, fontSize: 8, color: MUTED },
  totalBox: { marginTop: 18, alignSelf: 'flex-end', width: 220, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 12, paddingHorizontal: 14 },
  totalLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  footer: { position: 'absolute', left: 48, right: 48, bottom: 36, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 10, fontSize: 8, color: MUTED, textAlign: 'center' },
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

  return (
    <Document title="Aviso de Pago" author="Hospedaje Por Días">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.title}>AVISO DE PAGO</Text>
            <Text style={styles.subtitle}>Fecha de emisión: {formatInvoiceDate(data.issuedAt)}</Text>
          </View>
        </View>
        <View style={styles.rule} />

        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Huésped</Text>
            <Text style={styles.value}>{data.guestName}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Propiedad</Text>
            <Text style={styles.value}>{data.propertyName}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>{formatInvoiceDate(data.checkIn)}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>{formatInvoiceDate(data.checkOut)}</Text>
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.headText, styles.colConcept]}>Concepto</Text>
          <Text style={[styles.headText, styles.colAmount]}>Monto (USD)</Text>
        </View>
        {rows.map((row, index) => (
          <View key={`${row.concept}-${index}`} style={styles.tableRow} wrap={false}>
            <View style={styles.colConcept}>
              <Text>{row.concept}</Text>
              {row.detail ? <Text style={styles.detail}>{row.detail}</Text> : null}
            </View>
            <Text style={styles.colAmount}>{formatMoney(row.amount)}</Text>
          </View>
        ))}

        <View style={styles.totalBox} wrap={false}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>{formatMoney(totals.total)}</Text>
        </View>

        <Text style={styles.footer} fixed>
          Este documento es un aviso de pago y no constituye una factura fiscal. · Hospedaje Por Días
        </Text>
      </Page>
    </Document>
  );
};
