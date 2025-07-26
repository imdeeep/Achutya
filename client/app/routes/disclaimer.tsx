import Layout from '~/components/layout/Layout'

export default function Disclaimer() {
  return (
    <Layout>

      <div className="bg-white text-gray-800 px-6 py-12 max-w-full mx-auto space-y-10">
        <div className="flex flex-col items-center justify-center px-4 py-16 md:px-20 lg:px-40">
          <h1 className="text-4xl font-bold mb-8 text-center">DISCLAIMER</h1>
          <div className="max-w-4xl text-lg space-y-6 text-justify text-gray-800">
            <p>
              WanderOn provides the www.wanderon.in Web site as a service to the
              public and Web site owners.
            </p>
            <p>
              WanderOn is not responsible for, and expressly disclaims all
              liability for, damages of any kind arising out of use, reference to,
              or reliance on any information contained within the site. While the
              information contained within the site is periodically updated, no
              guarantee is given that the information provided in this Website is
              correct, complete, and up-to-date.
            </p>
            <p>
              Although the WanderOn Website may include links providing direct
              access to other Internet resources, including Web sites, WanderOn is
              not responsible for the accuracy or content of information contained
              in these sites.
            </p>
            <p>
              Links from wanderon.in to third-party sites do not constitute an
              endorsement by WanderOn of the parties or their products and
              services. The appearance on the Web site of advertisements and
              product or service information does not constitute an endorsement by
              WanderOn.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}