// @ts-nocheck
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts using reliable Google Fonts URLs
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf', fontWeight: 700 },
  ]
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#1a1a2e',
    backgroundColor: '#fff',
  },
  // Header with solid gradient-like background
  header: {
    backgroundColor: '#1a1438',
    padding: '36pt 42pt 30pt',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    flex: 1,
  },
  fullName: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 3,
    color: '#ffffff',
  },
  jobTitle: {
    fontSize: 10,
    color: '#c4b5fd',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contactBar: {
    backgroundColor: '#f5f3ff',
    padding: '9pt 42pt',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderBottom: '1pt solid #e5e2f0',
  },
  contactItem: {
    fontSize: 8,
    color: '#4c1d95',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    padding: '24pt 42pt 36pt',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    borderBottom: '2pt solid #7c3aed',
    paddingBottom: 4,
  },
  summary: {
    fontSize: 9.5,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
    borderLeft: '2pt solid #7c3aed',
    paddingLeft: 12,
    marginTop: 6,
  },
  experienceItem: {
    marginBottom: 18,
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 12,
  },
  expHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expRole: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  expDuration: {
    fontSize: 8.5,
    color: '#7c3aed',
    fontWeight: 600,
  },
  expCompany: {
    fontSize: 9,
    color: '#6d28d9',
    marginBottom: 2,
  },
  expLocation: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
    marginLeft: 12,
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 14,
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 12,
  },
  eduHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  eduDegree: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  eduDuration: {
    fontSize: 8,
    color: '#7c3aed',
    fontWeight: 600,
  },
  eduSchool: {
    fontSize: 8.5,
    color: '#6d28d9',
    marginBottom: 2,
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  skillChip: {
    backgroundColor: '#f5f3ff',
    color: '#4c1d95',
    fontSize: 8,
    fontWeight: 600,
    padding: '3pt 8pt',
    borderRadius: 4,
    border: '0.5pt solid #e5e2f0',
  },
  languagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  languageChip: {
    backgroundColor: '#f5f3ff',
    border: '0.5pt solid #e5e2f0',
    borderRadius: 6,
    padding: '5pt 10pt',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  languageName: {
    fontSize: 8.5,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  languageLevel: {
    fontSize: 8,
    color: '#6b7280',
  },
  personalDetailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6pt',
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 12,
    marginBottom: 20,
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 8.5,
    color: '#374151',
  },
  detailLabel: {
    fontWeight: 600,
    color: '#4c1d95',
    marginRight: 4,
    minWidth: 80,
  },
})

interface CVData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    phoneCode: string
    country: string
    county: string
    location: string
    website: string
    linkedin: string
    github: string
    facebook: string
    summary: string
    profileImage: string
    dateOfBirth: string
    nationality: string
    gender: string
    passport: string
    workPermit: string
    placeOfBirth: string
  }
  experience: Array<{
    id: string
    role: string
    company: string
    duration: string
    location: string
    description: string[]
    workDescription: string
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    duration: string
    location: string
    fieldOfStudy: string
    grade: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    link: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
  volunteering: Array<{
    id: string
    role: string
    organization: string
    duration: string
    location: string
    description: string
  }>
}

export function CVDocument({ data }: { data: CVData }) {
  const personalInfo = data?.personalInfo || {}
  const experience = data?.experience || []
  const education = data?.education || []
  const skills = data?.skills || []
  const languages = data?.languages || []
  const projects = data?.projects || []
  const volunteering = data?.volunteering || []
  
  const allSkills = skills?.flatMap((s) => s.items) || []
  const hasPersonalDetails = personalInfo?.dateOfBirth || personalInfo?.nationality || personalInfo?.gender || personalInfo?.passport || personalInfo?.workPermit || personalInfo?.placeOfBirth

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.fullName}>{personalInfo?.fullName || 'Your Name'}</Text>
            <Text style={styles.jobTitle}>{personalInfo?.jobTitle || 'Professional Title'}</Text>
          </View>
        </View>

        {/* Contact Bar */}
        <View style={styles.contactBar}>
          {personalInfo?.phone && (
            <Text style={styles.contactItem}>{personalInfo?.phoneCode || ''} {personalInfo?.phone}</Text>
          )}
          {personalInfo?.email && (
            <Text style={styles.contactItem}>{personalInfo?.email}</Text>
          )}
          {personalInfo?.country && (
            <Text style={styles.contactItem}>{personalInfo?.country}</Text>
          )}
          {personalInfo?.linkedin && (
            <Text style={styles.contactItem}>{personalInfo?.linkedin}</Text>
          )}
          {personalInfo?.website && (
            <Text style={styles.contactItem}>{personalInfo?.website}</Text>
          )}
          {personalInfo?.github && (
            <Text style={styles.contactItem}>{personalInfo?.github}</Text>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          {/* Summary */}
          {personalInfo?.summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Professional Profile</Text>
              <Text style={styles.summary}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Personal Details */}
          {hasPersonalDetails && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View style={styles.personalDetailsGrid}>
                {personalInfo?.dateOfBirth && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date of Birth:</Text>
                    <Text>{personalInfo.dateOfBirth}</Text>
                  </View>
                )}
                {personalInfo?.nationality && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Nationality:</Text>
                    <Text>{personalInfo.nationality}</Text>
                  </View>
                )}
                {personalInfo?.gender && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender:</Text>
                    <Text>{personalInfo.gender}</Text>
                  </View>
                )}
                {personalInfo?.passport && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Passport:</Text>
                    <Text>{personalInfo.passport}</Text>
                  </View>
                )}
                {personalInfo?.workPermit && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Work Permit:</Text>
                    <Text>{personalInfo.workPermit}</Text>
                  </View>
                )}
                {personalInfo?.placeOfBirth && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Place of Birth:</Text>
                    <Text>{personalInfo.placeOfBirth}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{exp.role || ''}</Text>
                    <Text style={styles.expDuration}>{exp.duration || ''}</Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company || ''}</Text>
                  {exp.location && (
                    <Text style={styles.expLocation}>{exp.location}</Text>
                  )}
                  {exp.workDescription && (
                    <Text style={{ ...styles.bullet, marginBottom: 6 }}>{exp.workDescription}</Text>
                  )}
                  {exp.description && exp.description.map((bullet, i) => (
                    <Text key={i} style={styles.bullet}>• {bullet}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Education & Training</Text>
              {education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <View style={styles.eduHeader}>
                    <Text style={styles.eduDegree}>{edu.degree || ''}</Text>
                    <Text style={styles.eduDuration}>{edu.duration || ''}</Text>
                  </View>
                  <Text style={styles.eduSchool}>{edu.school || ''}</Text>
                  {edu.location && (
                    <Text style={styles.expLocation}>{edu.location}</Text>
                  )}
                  {(edu.fieldOfStudy || edu.grade) && (
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 2 }}>
                      {edu.fieldOfStudy && (
                        <Text style={styles.expLocation}>
                          <Text style={{ fontWeight: 600, color: '#4c1d95' }}>Field: </Text>
                          {edu.fieldOfStudy}
                        </Text>
                      )}
                      {edu.grade && (
                        <Text style={styles.expLocation}>
                          <Text style={{ fontWeight: 600, color: '#4c1d95' }}>Grade: </Text>
                          {edu.grade}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {allSkills && allSkills.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Core Competencies</Text>
              <View style={styles.skillsContainer}>
                {allSkills.map((skill, i) => (
                  <View key={i} style={styles.skillChip}>
                    <Text>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.languagesContainer}>
                {languages.map((lang, i) => (
                  <View key={i} style={styles.languageChip}>
                    <Text style={styles.languageName}>{lang.name || ''}</Text>
                    <Text style={styles.languageLevel}>- {lang.proficiency || ''}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Key Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{proj.name || ''}</Text>
                  </View>
                  {proj.link && (
                    <Text style={styles.expLocation}>{proj.link}</Text>
                  )}
                  {proj.description && (
                    <Text style={{ ...styles.bullet, marginTop: 4 }}>{proj.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Volunteering */}
          {volunteering && volunteering.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Volunteering Experience</Text>
              {volunteering.map((vol) => (
                <View key={vol.id} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{vol.role || ''}</Text>
                    {vol.duration && (
                      <Text style={styles.expDuration}>{vol.duration}</Text>
                    )}
                  </View>
                  <Text style={styles.expCompany}>{vol.organization || ''}</Text>
                  {vol.location && (
                    <Text style={styles.expLocation}>{vol.location}</Text>
                  )}
                  {vol.description && (
                    <Text style={{ ...styles.bullet, marginTop: 4 }}>{vol.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
