'use client'

import { motion } from 'framer-motion'
import { Section, CodeBlock, CodeComment, CodeKeyword, CodeString, CodeFunction, CheckCircle } from '@/components/ui'
import { fadeUp, slideInLeft, slideInRight, viewportOnce } from '@/lib/motion'
import { homeContent } from '@/lib/content'

export function ExpertiseSection() {
  const { expertise } = homeContent

  return (
    <Section id="expertise">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Code Block Visual */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <CodeBlock>
            <code>
              <CodeComment>Trade workflow configuration</CodeComment>
              <br />
              <CodeKeyword>workflow</CodeKeyword> <CodeFunction>EquitySwapBooking</CodeFunction> {'{'}
              <br />
              {'  '}<CodeKeyword>trigger:</CodeKeyword> <CodeString>&quot;trade.new&quot;</CodeString>
              <br />
              {'  '}<CodeKeyword>validate:</CodeKeyword> [<CodeString>&quot;counterparty&quot;</CodeString>, <CodeString>&quot;limits&quot;</CodeString>]
              <br />
              {'  '}<CodeKeyword>enrich:</CodeKeyword> [<CodeString>&quot;marketData&quot;</CodeString>, <CodeString>&quot;static&quot;</CodeString>]
              <br />
              {'  '}<CodeKeyword>route:</CodeKeyword> <CodeFunction>riskEngine</CodeFunction> → <CodeFunction>confirm</CodeFunction>
              <br />
              {'}'}
            </code>
          </CodeBlock>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="text-display-sm md:text-display-md font-bold mb-6">
            {expertise.title}
          </h2>
          <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
            {expertise.description}
          </p>
          <ul className="space-y-4">
            {expertise.features.map((feature, index) => (
              <motion.li
                key={feature}
                className="flex items-start gap-3"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle className="flex-shrink-0 mt-0.5" />
                <span className="text-body-md text-text-secondary">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  )
}
