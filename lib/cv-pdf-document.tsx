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
    fontSize: 9,
    color: '#1a1a2e',
    backgroundColor: '#fff',
  },
  // Header with solid gradient-like background (Midnight Elegance style)
  header: {
    backgroundColor: '#0f0c29',
    paddingTop: '30pt',
    paddingBottom: '24pt',
    paddingHorizontal: '42pt',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    flex: 1,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 3,
    color: '#ffffff',
  },
  jobTitle: {
    fontSize: 9,
    color: '#c4b5fd',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contactBar: {
    backgroundColor: '#f5f3ff',
    paddingVertical: '8pt',
    paddingHorizontal: '42pt',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderBottom: '1pt solid #e5e2f0',
  },
  contactItem: {
    fontSize: 7.5,
    color: '#4c1d95',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  contactIcon: {
    fontSize: 7,
    color: '#4c1d95',
    marginRight: 2,
  },
  section: {
    paddingVertical: '18pt',
    paddingHorizontal: '42pt',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    borderBottom: '2pt solid #7c3aed',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 8.5,
    color: '#374151',
    lineHeight: 1.5,
    textAlign: 'justify',
    borderLeft: '2pt solid #7c3aed',
    paddingLeft: 10,
    marginTop: 4,
  },
  experienceItem: {
    marginBottom: 12,
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 10,
  },
  expHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expRole: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  expDuration: {
    fontSize: 7.5,
    color: '#7c3aed',
    fontWeight: 600,
  },
  expCompany: {
    fontSize: 8,
    color: '#6d28d9',
    marginBottom: 2,
  },
  expLocation: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 3,
  },
  bullet: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.4,
    marginLeft: 10,
    marginBottom: 2,
  },
  educationItem: {
    marginBottom: 10,
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 10,
  },
  eduHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  eduDegree: {
    fontSize: 8.5,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  eduDuration: {
    fontSize: 7,
    color: '#7c3aed',
    fontWeight: 600,
  },
  eduSchool: {
    fontSize: 7.5,
    color: '#6d28d9',
    marginBottom: 2,
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  skillChip: {
    backgroundColor: '#f5f3ff',
    color: '#4c1d95',
    fontSize: 7,
    fontWeight: 600,
    paddingVertical: '2pt',
    paddingHorizontal: '6pt',
    borderRadius: 3,
    border: '0.5pt solid #e5e2f0',
  },
  languagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  languageChip: {
    backgroundColor: '#f5f3ff',
    border: '0.5pt solid #e5e2f0',
    borderRadius: 4,
    paddingVertical: '3pt',
    paddingHorizontal: '7pt',
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  },
  languageName: {
    fontSize: 7.5,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  languageLevel: {
    fontSize: 7,
    color: '#6b7280',
  },
  personalDetailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4pt',
    borderLeft: '1.5pt solid #e5e2f0',
    paddingLeft: 10,
    marginBottom: 14,
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 7.5,
    color: '#374151',
  },
  detailLabel: {
    fontWeight: 600,
    color: '#4c1d95',
    marginRight: 4,
    minWidth: 75,
  },
  sectionWrapper: {
    marginBottom: 14,
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
      <Page size="A4" style={styles.page} wrap>
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
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞 </Text>
              {personalInfo?.phoneCode || ''} {personalInfo?.phone}
            </Text>
          )}
          {personalInfo?.email && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉ </Text>
              {personalInfo?.email}
            </Text>
          )}
          {personalInfo?.country && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍 </Text>
              {personalInfo?.country}
            </Text>
          )}
          {personalInfo?.county && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>🗺 </Text>
              {personalInfo?.county}
            </Text>
          )}
          {personalInfo?.location && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>📮 </Text>
              {personalInfo?.location}
            </Text>
          )}
          {personalInfo?.linkedin && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>💼 </Text>
              {personalInfo?.linkedin}
            </Text>
          )}
          {personalInfo?.website && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>🌐 </Text>
              {personalInfo?.website}
            </Text>
          )}
          {personalInfo?.github && (
            <Text style={styles.contactItem}>
              <Text style={styles.contactIcon}>⌨ </Text>
              {personalInfo?.github}
            </Text>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          {/* Summary */}
          {personalInfo?.summary && (
            <View style={styles.sectionWrapper}>
              <Text style={styles.sectionTitle}>Professional Profile</Text>
              <Text style={styles.summary}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Personal Details */}
          {hasPersonalDetails && (
            <View style={styles.sectionWrapper}>
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
            <View style={styles.sectionWrapper}>
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
                    <Text style={{ ...styles.bullet, marginBottom: 4 }}>{exp.workDescription}</Text>
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
            <View style={styles.sectionWrapper}>
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
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 2 }}>
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
            <View style={styles.sectionWrapper}>
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
            <View style={styles.sectionWrapper}>
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
            <View style={styles.sectionWrapper}>
              <Text style={styles.sectionTitle}>Key Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{proj.name || ''}</Text>
                    {proj.link && (
                      <Text style={styles.expLocation}>{proj.link}</Text>
                    )}
                  </View>
                  {proj.description && (
                    <Text style={{ ...styles.bullet, marginTop: 3 }}>{proj.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Volunteering */}
          {volunteering && volunteering.length > 0 && (
            <View style={styles.sectionWrapper}>
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
                    <Text style={{ ...styles.bullet, marginTop: 3 }}>{vol.description}</Text>
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
