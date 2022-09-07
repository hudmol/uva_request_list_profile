module UvaTopdesk
  class ArchivalObjectMapper < ItemMapper

    RequestList.register_item_mapper(self, :uva_topdesk, ArchivalObject)

    def request_permitted?(item)
      # not if restrictions apply
      return false if item['json']['restrictions_apply']

      # not if it lacks an instance
      return false if item['json']['instances'].empty?

      # not if it lacks a container instance
      return false unless item['json']['instances'].find{|inst| inst['sub_container']}

      # otherwise the request is permitted
      return true
    end


    def map_extensions(mapped, item, repository, resource, resource_json)
      super
      mapped.ext(:level).name = item['level'].capitalize
      mapped.collection.ext(:finding_aid_author , resource_json['finding_aid_author'])
      mapped.collection.ext(:related_accession, resource_json['related_accessions'].map{|ra| ra['ref']}.join(', '))
    end


    def form_fields(mapped)
      shared_fields = {
        'resource_title'               => mapped.collection.name,
        'resource_id'                  => mapped.collection.id,
        'resource_uri'                 => mapped.collection.uri,
        'resource_finding_aid_author'  => mapped.collection.ext(:finding_aid_author),
        'resource_related_accession'   => mapped.collection.ext(:related_accession),

        'ao_title'                     => mapped.record.name,
        'ao_id'                        => mapped.record.id,
        'ao_uri'                       => mapped.record.uri,

        'creator'                      => mapped.creator.name,
        'date'                         => mapped.date.name,
        'location'                     => mapped.ext(:location).name,
        'physical_location'            => mapped.ext(:physical_location).name,
        'access_restrictions'          => mapped.record.ext(:access_restrictions),
        'resource_access_restrictions' => mapped.collection.ext(:access_restrictions),
      }

      return [as_topdesk_request(shared_fields)] unless mapped.container.has_multi?

      mapped.container.multi.map {|c|
        as_topdesk_request(with_mapped_container(mapped, shared_fields, c))
      }
    end

  end
end
