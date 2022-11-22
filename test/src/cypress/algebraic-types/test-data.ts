export const programs = [
  {
    id: 51,
    name: 'Biostatistics ( BIO )',
    description: 'Biostatistics is has a team of biostasticians to help.',
    services: [
      {
        id: 8430,
        name: 'ABS Network Membership',
        description: null
      },
      {
        id: 176,
        name: 'Abstract preparation',
        description: 'Providing helpt with writing paper abstracts'
      },
      {
        id: 160,
        name: 'Consultation',
        description: null
      }
    ]
  },
  {
    id: 8560,
    name: 'Center for Drug Repurposing ( CDR )',
    description: null,
    services: [
      {
        id: 8568,
        name: 'Analytical Support',
        description: null
      },
      {
        id: 8565,
        name: 'Biostatistics/Clinical Informatics Support',
        description: 'Providing help with data modeling, analysis and storage.'
      },
      {
        id: 8567,
        name: 'Compound synthesis',
        description: null
      }
    ]
  }
];

export const organizations = [
  {
    id: 2502,
    name: 'Aastrom Biosciences',
    city: {
      id: 2501,
      name: 'Ann Arbor',
      state: 2500
    }
  },
  {
    id: 8386,
    name: 'Abington Hospital - Jefferson Health',
    city: {
      id: 8382,
      name: 'Abington',
      state: 2651
    }
  },
  {
    id: 2569,
    name: 'Harvard University - CTSA',
    city: {
      id: 2568,
      name: 'Cambridge',
      state: 2520
    }
  }
];

export const states = [
  {id: 2500, name: 'Michigan', short: 'MI'},
  {id: 2651, name: 'Pennsylvania', short: 'PA'},
  {id: 2520, name: 'Massachusetts', short: 'MA'}
];

export const serviceProvided = {
  id: 1,
  program: 51,
  service: 176,
  clients: [8386, 2569]
};

interface TestObjectWithId {
  id: number;
  [key: string]: any;
}
function findObjectById<T extends TestObjectWithId>(objects: T[]) {
  return (id: number) => objects.find((o) => o.id === id);
}

export const getStateById = findObjectById(states);
export const getOrgById = findObjectById(organizations);

function buildObjectCollector<T>(getById: (id: number) => T) {
  // @ts-ignore
  return (objIds: number[]) => objIds.reduce((acc, id) => acc.concat(getById(id)), []);
}

// @ts-ignore
export const collectStatesByOrgIds = buildObjectCollector((id) => getStateById(getOrgById(id).city.state));
