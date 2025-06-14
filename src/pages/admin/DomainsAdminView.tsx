import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useDomains from "../../hooks/useDomains";
import useGetAllSubdomains from "../../hooks/useGetAllSubdomains";
import SubDomain from "../../entities/SubDomain";
import DomainTopic from "../../entities/DomainTopic";
import useDomainTopics from "../../hooks/useDomainTopics";
import { useAddDomain } from "../../hooks/useAddDomain";
import { Toaster } from "react-hot-toast";
import { useAddSubdomain } from "../../hooks/useAddSubdomain";
import { useAddDomainTopic } from "../../hooks/useAddDomainTopic";

interface Domain {
  _id: string;
  name: string;
  commonName: string;
}

const Domains = () => {
  const {
    data: domainsData,
    isLoading: domainsLoading,
    isError: domainsError,
    refetch: refetchDomains,
  } = useDomains();
  const {
    data: subdomainsData,
    isLoading: subdomainsLoading,
    isError: subdomainsError,
    refetch: refetchSubdomains,
  } = useGetAllSubdomains();
  const {
    data: topicsData,
    isLoading: topicsLoading,
    isError: topicsError,
    refetch: refetchTopics,
  } = useDomainTopics();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [subdomains, setSubdomains] = useState<SubDomain[]>([]);
  const [topics, setTopics] = useState<DomainTopic[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [newSubdomain, setNewSubdomain] = useState({ name: "", parentId: "" });
  const [newTopic, setNewTopic] = useState({ name: "", parentId: "" });
  const domainMutation = useAddDomain();
  const addSubdomain = useAddSubdomain();
  const addDomainTopic = useAddDomainTopic();

  useEffect(() => {
    if (domainsData) {
      setDomains(domainsData);
    }
    if (subdomainsData) {
      setSubdomains(subdomainsData);
    }
    if (topicsData) {
      setTopics(topicsData);
    }
  }, [domainsData, subdomainsData, topicsData]);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error("Domain name is required");
      return;
    }

    const result = await domainMutation.mutateAsync(newDomain);

    if (result) {
      toast.success("Domain added successfully");
      setNewDomain("");
      refetchDomains();
    }
  };

  const handleAddSubdomain = async () => {
    if (!newSubdomain.name.trim() || !newSubdomain.parentId) {
      toast.error("Subdomain name and parent domain are required");
      return;
    }

    const result = await addSubdomain.mutateAsync({
      subdomain: newSubdomain.name,
      parentId: newSubdomain.parentId,
    });
    if (result) {
      toast.success("Subdomain added successfully");
      setNewSubdomain({ name: "", parentId: "" });
      refetchSubdomains();
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.name.trim() || !newTopic.parentId) {
      toast.error("Topic name and parent subdomain are required");
      return;
    }

    const result = await addDomainTopic.mutateAsync({
      topic: newTopic.name,
      parentId: newTopic.parentId,
    });
    if (result) {
      toast.success("Topic added successfully");
      setNewTopic({ name: "", parentId: "" });
      refetchTopics();
    }
  };

  const loading = domainsLoading || subdomainsLoading || topicsLoading;
  const error = domainsError || subdomainsError || topicsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-error text-center h-screen flex justify-center items-center">
        {error}
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Domain Management</h1>

        <div className="flex gap-6">
          {/* Left side - Data Tables */}
          <div className="w-2/3 space-y-6 h-[85vh] overflow-y-auto">
            {/* Domains Table */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Domains</h2>
                {domains.length === 0 && (
                  <div className="text-center">No domains found</div>
                )}
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Common Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains &&
                        domains.map((domain) => (
                          <tr key={domain._id}>
                            <td>{domain.name}</td>
                            <td>{domain.commonName}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Subdomains Table */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Subdomains</h2>
                {subdomains.length === 0 && (
                  <div className="text-center">No subdomains found</div>
                )}
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Common Name</th>
                        <th>Parent Domain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subdomains &&
                        subdomains.map((subdomain) => (
                          <tr key={subdomain._id}>
                            <td>{subdomain.name}</td>
                            <td>{subdomain.commonName}</td>
                            <td>{subdomain.parentDomain.name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Topics Table */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Topics</h2>
                {topics.length === 0 && (
                  <div className="text-center">No topics found</div>
                )}
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Parent Subdomain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics &&
                        topics.map((topic) => (
                          <tr key={topic._id}>
                            <td>{topic.name}</td>
                            <td>
                              {topic.parentSubdomain?.name ||
                                "No parent subdomain"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Forms */}
          <div className="w-1/3 space-y-6">
            {/* Add Domain Form */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Add New Domain</h2>
                <form
                  onSubmit={handleAddDomain}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="Enter domain name"
                    className="input input-bordered w-full"
                  />
                  <button
                    type="submit"
                    className="btn bg-yellow btn-ghost w-full text-darkgrey"
                    disabled={domainMutation.isPending || !newDomain.trim()}
                  >
                    {" "}
                    {domainMutation.isPending ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Add Domain"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Add Subdomain Form */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Add New Subdomain</h2>
                <form
                  onSubmit={handleAddSubdomain}
                  className="flex flex-col gap-4"
                >
                  <select
                    value={newSubdomain.parentId}
                    onChange={(e) =>
                      setNewSubdomain((prev) => ({
                        ...prev,
                        parentId: e.target.value,
                      }))
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Parent Domain</option>
                    {domains &&
                      domains.map((domain: Domain) => (
                        <option key={domain._id} value={domain._id}>
                          {domain.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={newSubdomain.name}
                    onChange={(e) =>
                      setNewSubdomain((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter subdomain name"
                    className="input input-bordered w-full"
                  />
                  <button
                    type="submit"
                    className="btn bg-yellow btn-ghost w-full text-darkgrey"
                    disabled={
                      addSubdomain.isPending ||
                      !newSubdomain.name.trim() ||
                      !newSubdomain.parentId
                    }
                  >
                    {" "}
                    {addSubdomain.isPending ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Add Subdomain"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Add Topic Form */}
            <div className="card bg-base-200 rounded-md">
              <div className="card-body">
                <h2 className="card-title">Add New Topic</h2>
                <form onSubmit={handleAddTopic} className="flex flex-col gap-4">
                  <select
                    value={newTopic.parentId}
                    onChange={(e) =>
                      setNewTopic((prev) => ({
                        ...prev,
                        parentId: e.target.value,
                      }))
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Parent Subdomain</option>
                    {subdomains &&
                      subdomains.map((subdomain) => (
                        <option key={subdomain._id} value={subdomain._id}>
                          {subdomain.name} ({subdomain.parentDomain.name})
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) =>
                      setNewTopic((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter topic name"
                    className="input input-bordered w-full"
                  />
                  <button
                    type="submit"
                    className="btn bg-yellow btn-ghost w-full text-darkgrey"
                    disabled={
                      addDomainTopic.isPending ||
                      !newTopic.name.trim() ||
                      !newTopic.parentId
                    }
                  >
                    {" "}
                    {addDomainTopic.isPending ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Add Topic"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Domains;
