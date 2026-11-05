import { PROFILE } from "./constants";

export function generateVCardData() {
  return `BEGIN:VCARD
VERSION:3.0
N:Vijay;S.;;;
FN:S. Vijay
ORG:VIBE MEDIA NETWORKS
TITLE:Senior Consultant - Creator Acquisition & Growth
TEL;TYPE=CELL,VOICE:${PROFILE.phone}
EMAIL;TYPE=WORK,INTERNET:${PROFILE.email}
URL:${PROFILE.websiteUrl}
ADR;TYPE=WORK:;;;Tamil Nadu;;;India
NOTE:Digital Talent & Media Scouting Agency - S. Vijay | Senior Consultant
END:VCARD`;
}

export function downloadVCard() {
  const vcardData = generateVCardData();
  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "S_Vijay_VibeMediaNetworks.vcf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
