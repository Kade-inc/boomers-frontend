import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useDomains from "../../hooks/useDomains";
import useSubDomains from "../../hooks/useSubDomains";
import useGetAllSubdomains from "../../hooks/useGetAllSubdomains";
import SubDomain from "../../entities/SubDomain";
import DomainTopic from "../../entities/DomainTopic";
import useDomainTopics from "../../hooks/useDomainTopics";
import { useAddDomain } from "../../hooks/useAddDomain";
import { useAddSubdomain } from "../../hooks/useAddSubdomain";
import { useAddDomainTopic } from "../../hooks/useAddDomainTopic";
import { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import Domain from "../../entities/Domain";
import { useUpdateDomain } from "../../hooks/useUpdateDomain";
import { useUpdateSubdomain } from "../../hooks/useUpdateSubdomain";
import { useUpdateDomainTopic } from "../../hooks/useUpdateDomainTopic";

const DomainsAdminView = () => {
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
  const subdomainMutation = useAddSubdomain();
  const topicMutation = useAddDomainTopic();
  const updateDomainMutation = useUpdateDomain();
  const updateSubdomainMutation = useUpdateSubdomain();
  const updateDomainTopicMutation = useUpdateDomainTopic();
  // Edit states
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [editingSubdomain, setEditingSubdomain] = useState<SubDomain | null>(null);
  const [editingTopic, setEditingTopic] = useState<DomainTopic | null>(null);

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

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      toast.error("Domain name is required");
      return;
    }

    try {
      await domainMutation.mutateAsync(newDomain);
      toast.success("Domain added successfully");
      setNewDomain("");
      refetchDomains();
    } catch (error) {
      toast.error("Failed to add domain");
    }
  };

  const handleAddSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubdomain.name.trim() || !newSubdomain.parentId) {
      toast.error("Subdomain name and parent domain are required");
      return;
    }

    try {
      await subdomainMutation.mutateAsync({
        subdomain: newSubdomain.name,
        parentId: newSubdomain.parentId
      });
      toast.success("Subdomain added successfully");
      setNewSubdomain({ name: "", parentId: "" });
      refetchSubdomains();
    } catch (error) {
      toast.error("Failed to add subdomain");
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.name.trim() || !newTopic.parentId) {
      toast.error("Topic name and parent subdomain are required");
      return;
    }

    try {
      await topicMutation.mutateAsync({
        topic: newTopic.name,
        parentId: newTopic.parentId
      });
      toast.success("Topic added successfully");
      setNewTopic({ name: "", parentId: "" });
      refetchTopics();
    } catch (error) {
      toast.error("Failed to add topic");
    }
  };

  const handleEditDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDomain) return;

    try {
      const response = await updateDomainMutation.mutateAsync({
        id: editingDomain._id,
        name: editingDomain.name
      });

      if (response) {
        toast.success("Domain updated successfully");
        setEditingDomain(null);
        refetchDomains();
      } else {
        toast.error("Failed to update domain");
      }
    } catch (error) {
      toast.error("Error updating domain");
    }
  };

  const handleEditSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubdomain) return;

    try {
      const response = await updateSubdomainMutation.mutateAsync({
        id: editingSubdomain._id,
        name: editingSubdomain.name
      });

      if (response) {
        toast.success("Subdomain updated successfully");
        setEditingSubdomain(null);
        refetchSubdomains();
      } else {
        toast.error("Failed to update subdomain");
      }
    } catch (error) {
      toast.error("Error updating subdomain");
    }
  };

  const handleEditTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    try {
      const response = await updateDomainTopicMutation.mutateAsync({
        id: editingTopic._id,
        name: editingTopic.name
      });

      if (response) {
        toast.success("Topic updated successfully");
        setEditingTopic(null);
        refetchTopics();
      } else { 
        toast.error("Failed to update topic");
      }
    } catch (error) {
      toast.error("Error updating topic");
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) return;

    try {
      const response = await fetch(`/api/domains/${id}`, {
        method: 'DELETE',
        headers: {
          'requiresAuth': 'true'
        }
      });

      if (response.ok) {
        toast.success("Domain deleted successfully");
        refetchDomains();
      } else {
        toast.error("Failed to delete domain");
      }
    } catch (error) {
      toast.error("Error deleting domain");
    }
  };

  const handleDeleteSubdomain = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subdomain?")) return;

    try {
      const response = await fetch(`/api/subdomains/${id}`, {
        method: 'DELETE',
        headers: {
          'requiresAuth': 'true'
        }
      });

      if (response.ok) {
        toast.success("Subdomain deleted successfully");
        refetchSubdomains();
      } else {
        toast.error("Failed to delete subdomain");
      }
    } catch (error) {
      toast.error("Error deleting subdomain");
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      const response = await fetch(`/api/domains/domainTopics/${id}`, {
        method: 'DELETE',
        headers: {
          'requiresAuth': 'true'
        }
      });

      if (response.ok) {
        toast.success("Topic deleted successfully");
        refetchTopics();
      } else {
        toast.error("Failed to delete topic");
      }
    } catch (error) {
      toast.error("Error deleting topic");
    }
  };

  const isLoading = domainsLoading || subdomainsLoading || topicsLoading || domainMutation.isPending || subdomainMutation.isPending || topicMutation.isPending;
  const hasError = domainsError || subdomainsError || topicsError || domainMutation.error || subdomainMutation.error || topicMutation.error;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-error text-center h-screen flex justify-center items-center">
        An error occurred while loading the data
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains &&
                        domains.map((domain) => (
                          <tr key={domain._id}>
                            <td>{domain.name}</td>
                            <td>{domain.commonName}</td>
                            <td className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingDomain(domain);
                                }}
                                className="btn btn-sm btn-ghost"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteDomain(domain._id)}
                                className="btn btn-sm btn-ghost text-error"
                              >
                                <FaTrash />
                              </button>
                            </td>
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subdomains &&
                        subdomains.map((subdomain) => (
                          <tr key={subdomain._id}>
                            <td>{subdomain.name}</td>
                            <td>{subdomain.commonName}</td>
                            <td>{subdomain.parentDomain.name}</td>
                            <td className="flex gap-2">
                              <button
                                onClick={() => setEditingSubdomain(subdomain)}
                                className="btn btn-sm btn-ghost"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSubdomain(subdomain._id)}
                                className="btn btn-sm btn-ghost text-error"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Topics Table */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Topics</h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Parent Subdomain</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics && topics.map(topic => (
                        <tr key={topic._id}>
                          <td>{topic.name}</td>
                          <td>{topic.parentSubdomain?.name}</td>
                          <td className="flex gap-2">
                            <button 
                              onClick={() => setEditingTopic(topic)}
                              className="btn btn-sm btn-ghost"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteTopic(topic._id)}
                              className="btn btn-sm btn-ghost text-error"
                            >
                              <FaTrash />
                            </button>
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
                      subdomainMutation.isPending ||
                      !newSubdomain.name.trim() ||
                      !newSubdomain.parentId
                    }
                  >
                    {" "}
                    {subdomainMutation.isPending ? (
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
                      topicMutation.isPending ||
                      !newTopic.name.trim() ||
                      !newTopic.parentId
                    }
                  >
                    {" "}
                    {topicMutation.isPending ? (
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

      {/* Edit Domain Modal */}
      {editingDomain && (
        <div className="modal modal-open">
          <div className="modal-box rounded-md">
            <h3 className="font-bold text-lg mb-4">Edit Domain</h3>
            <form onSubmit={handleEditDomain}>
              <input
                type="text"
                value={editingDomain.name}
                onChange={(e) => setEditingDomain({ ...editingDomain, name: e.target.value })}
                className="input input-bordered w-full mb-4"
              />
              <div className="modal-action">
                <button type="submit" className="btn bg-yellow text-darkgrey" disabled={updateDomainMutation.isPending}>
                  {updateDomainMutation.isPending ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button type="button" className="btn" onClick={() => setEditingDomain(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subdomain Modal */}
      {editingSubdomain && (
        <div className="modal modal-open">
          <div className="modal-box rounded-md">
            <h3 className="font-bold text-lg mb-4">Edit Subdomain</h3>
            <form onSubmit={handleEditSubdomain}>
              <input
                type="text"
                value={editingSubdomain.name}
                onChange={(e) => setEditingSubdomain({ ...editingSubdomain, name: e.target.value })}
                className="input input-bordered w-full mb-4"
              />
              <div className="modal-action">
                <button type="submit" className="btn bg-yellow text-darkgrey" disabled={updateSubdomainMutation.isPending}>
                  {updateSubdomainMutation.isPending ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button type="button" className="btn" onClick={() => setEditingSubdomain(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {editingTopic && (
        <div className="modal modal-open">
          <div className="modal-box rounded-md">
            <h3 className="font-bold text-lg mb-4">Edit Topic</h3>
            <form onSubmit={handleEditTopic}>
              <input
                type="text"
                value={editingTopic.name}
                onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                className="input input-bordered w-full mb-4"
              />
              <div className="modal-action">
                <button 
                  type="submit" 
                  className="btn bg-yellow text-darkgrey" 
                  disabled={updateDomainTopicMutation.isPending}
                >
                  {updateDomainTopicMutation.isPending ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button type="button" className="btn" onClick={() => setEditingTopic(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DomainsAdminView;
