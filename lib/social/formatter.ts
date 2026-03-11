
export interface SocialPostData {
  title: string;
  company: string;
  url: string;
  description?: string;
  type: 'job' | 'scholarship';
  salary?: string;
}

export function formatSocialMessage(data: SocialPostData): string {
  const plainDescription = data.description 
    ? data.description.replace(/<[^>]*>/g, '').trim() 
    : "";
  
  const isScholarship = data.type === 'scholarship';
  const baseUrl = "https://cvmyjob.online";
  const fullUrl = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
  
  const directoryUrl = isScholarship 
    ? `${baseUrl}/graduate-programs` 
    : `${baseUrl}/scholarship-region`;

  if (isScholarship) {
    return `
🎓 *GRADUATE PROGRAM:* ${data.title}
🏢 *PROVIDER:* CVMYJOB
🔗 *APPLY HERE:* ${fullUrl}

📝 *DETAILS:*
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

🚀 Discover more verified programs at:
${directoryUrl}
    `.trim();
  }

  return `
🔥 *JOB OPPORTUNITY:* ${data.title}
🏢 *COMPANY:* ${data.company}
💰 *SALARY:* ${data.salary || "Not Specified"}
🔗 *APPLY HERE:* ${fullUrl}
    
📝 *DESCRIPTION:*
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

🔍 Search more opportunities at:
${directoryUrl}
  `.trim();
}
