
const stats = [
  { label: 'Healthcare Professionals', value: '50,000+' },
  { label: 'Research Papers Shared', value: '10,000+' },
  { label: 'Medical Cases Discussed', value: '25,000+' },
  { label: 'Countries Represented', value: '100+' },
];

const Stats = () => {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by Healthcare Professionals Worldwide
          </h2>
          <p className="mt-3 text-xl text-blue-200 sm:mt-4">
            Join the fastest-growing professional network for medical professionals
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                {stat.label}
              </dt>
              <dd className="order-1 text-5xl font-bold text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Stats;
